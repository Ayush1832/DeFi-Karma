import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DeFi Karma - Yield Orchestrated Public Goods Engine',
  description: 'Aggregate yield from multiple DeFi protocols and automatically donate a portion to public goods',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        {/* Suppress telemetry script errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalError = console.error;
                console.error = function(...args) {
                  const message = args.join(' ');
                  if (message && (message.includes('telemetry') || message.includes('Failed to execute'))) {
                    return;
                  }
                  originalError.apply(console, args);
                };
                
                window.addEventListener('error', function(e) {
                  if (e.message && (e.message.includes('telemetry') || e.message.includes('inlined telemetry'))) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }, true);
                
                window.addEventListener('unhandledrejection', function(e) {
                  const reason = e.reason;
                  if (reason && (
                    (typeof reason === 'string' && reason.includes('telemetry')) ||
                    (reason.message && reason.message.includes('telemetry'))
                  )) {
                    e.preventDefault();
                    return false;
                  }
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
