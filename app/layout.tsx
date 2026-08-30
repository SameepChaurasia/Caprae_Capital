import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Caprae LeadGenius AI | B2B Intelligence & Revenue Engine',
  description: 'Autonomous B2B lead intelligence, dynamic ICP qualification, and personalized outreach platform for Caprae Capital Partners.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="relative selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Ambient Glows */}
        <div className="glow-orb w-[500px] h-[500px] bg-indigo-500/20 -top-36 -left-28"></div>
        <div className="glow-orb w-[450px] h-[450px] bg-cyan-500/15 top-1/3 -right-36"></div>
        <div className="glow-orb w-[600px] h-[600px] bg-purple-500/15 -bottom-48 left-1/4"></div>

        {children}
      </body>
    </html>
  );
}
