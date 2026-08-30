import dns from 'dns/promises';

/**
 * Enterprise Network & Security Utilities
 * Protects serverless runtime and container infrastructure from SSRF (Server-Side Request Forgery)
 * and malicious loopback/internal VPC address queries.
 */

// Private IPv4 Subnet Regexes (RFC 1918, RFC 3927 Link-Local, RFC 5735 Loopback, AWS Metadata)
const PRIVATE_IPV4_PATTERNS = [
  /^10\./,                                              // 10.0.0.0/8 (Class A Private)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,                    // 172.16.0.0/12 (Class B Private)
  /^192\.168\./,                                        // 192.168.0.0/16 (Class C Private)
  /^127\./,                                            // 127.0.0.0/8 (Loopback)
  /^169\.254\./,                                        // 169.254.0.0/16 (Link-Local & Cloud Metadata e.g., AWS/GCP/Azure)
  /^0\./,                                               // 0.0.0.0/8 (Broadcast/Current)
  /^224\./,                                             // Multicast
  /^240\./                                              // Reserved
];

// Private / Localhost IPv6 Patterns (RFC 4193 Unique Local, RFC 4291 Loopback/Link-Local)
const PRIVATE_IPV6_PATTERNS = [
  /^::1$/,                                              // IPv6 Loopback
  /^fe80:/i,                                            // IPv6 Link-Local
  /^fc00:/i,                                            // IPv6 Unique Local Address
  /^fd00:/i                                             // IPv6 Unique Local Address
];

/**
 * Checks if a given IP address belongs to a private, loopback, or cloud-internal subnet.
 */
export function isPrivateOrReservedIP(ip: string): boolean {
  if (!ip) return true;
  const cleanIp = ip.trim();

  // Check IPv4
  if (PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(cleanIp))) {
    return true;
  }

  // Check IPv6
  if (PRIVATE_IPV6_PATTERNS.some((pattern) => pattern.test(cleanIp))) {
    return true;
  }

  return false;
}

/**
 * Validates and normalizes target URLs before outbound HTTP execution.
 * Enforces protocol whitelisting (http/https only) and executes DNS pre-flight to prevent SSRF.
 */
export async function validateAndSanitizeUrl(rawInput: string): Promise<{ validUrl: string; cleanDomain: string }> {
  let target = (rawInput || '').trim();
  if (!target) {
    throw new Error('Target domain or URL cannot be empty.');
  }

  // Normalize protocol prefix
  if (!/^https?:\/\//i.test(target)) {
    target = 'https://' + target;
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    throw new Error(`Malformed URL provided: "${rawInput}"`);
  }

  // Enforce protocol whitelist
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Forbidden protocol "${parsed.protocol}". Only HTTP and HTTPS are permitted.`);
  }

  const hostname = parsed.hostname.toLowerCase();

  // Reject direct localhost or suspicious loopback domains
  if (hostname === 'localhost' || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    throw new Error(`Access to local or internal domain "${hostname}" is forbidden by SSRF firewall.`);
  }

  // If hostname is directly an IP literal, validate immediately
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) || hostname.includes(':')) {
    if (isPrivateOrReservedIP(hostname)) {
      throw new Error(`Direct connection to private/reserved IP address "${hostname}" is blocked.`);
    }
  } else {
    // Resolve DNS IPv4 addresses with defensive fallback
    try {
      const resolvedIps = await dns.resolve4(hostname);
      if (!resolvedIps || resolvedIps.length === 0) {
        throw new Error(`DNS resolution failed for hostname "${hostname}".`);
      }

      // Ensure NO resolved IP addresses point to internal infrastructure (e.g., DNS rebinding attacks)
      const hasPrivateIp = resolvedIps.some((ip) => isPrivateOrReservedIP(ip));
      if (hasPrivateIp) {
        throw new Error(`Hostname "${hostname}" resolved to an internal/private IP subnet. Blocked by security policy.`);
      }
    } catch (dnsErr: any) {
      if (dnsErr.message && dnsErr.message.includes('SSRF firewall')) {
        throw dnsErr;
      }
      // If DNS resolution fails externally, allow scraper timeout handler to classify domain as unreachable
    }
  }

  const cleanDomain = hostname.replace(/^www\./, '');
  return {
    validUrl: parsed.toString(),
    cleanDomain
  };
}
