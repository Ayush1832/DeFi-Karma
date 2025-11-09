import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* Suppress telemetry script errors - runs before interactive */}
        {/* This script suppresses errors that webpack replacement might miss */}
        <Script
          id="suppress-telemetry-errors"
          strategy="beforeInteractive"
          key="suppress-telemetry"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Must run immediately, before any other scripts
                if (typeof window === 'undefined') return;
                
                // Set flag to disable telemetry
                window.__BASE_ACCOUNT_TELEMETRY_DISABLED__ = true;
                window.__SUPPRESS_TELEMETRY_ERRORS__ = true;
                
                // Override console methods FIRST
                const originalError = console.error;
                const originalWarn = console.warn;
                
                console.error = function(...args) {
                  try {
                    const msg = args.map(String).join(' ').toLowerCase();
                    if (
                      msg.includes('telemetry') ||
                      msg.includes('failed to execute inlined telemetry script') ||
                      msg.includes('inlined telemetry') ||
                      msg.includes('@base-org/account') ||
                      msg.includes('initcca') ||
                      msg.includes('loadtelemetryscript') ||
                      msg === 'undefined' ||
                      !msg.trim()
                    ) {
                      return;
                    }
                    originalError.apply(console, args);
                  } catch (e) {
                    // Silent fail
                  }
                };
                
                console.warn = function(...args) {
                  try {
                    const msg = args.map(String).join(' ').toLowerCase();
                    if (
                      msg.includes('telemetry') ||
                      msg.includes('@base-org/account') ||
                      msg.includes('initcca')
                    ) {
                      return;
                    }
                    originalWarn.apply(console, args);
                  } catch (e) {
                    // Silent fail
                  }
                };
                
                // Error event handler - MUST use capture phase
                function suppressError(e) {
                  try {
                    const msg = ((e.message || '') + (e.filename || '') + (e.error?.message || '')).toLowerCase();
                    if (
                      msg.includes('telemetry') ||
                      msg.includes('failed to execute') ||
                      msg.includes('@base-org/account') ||
                      msg.includes('initcca') ||
                      !msg ||
                      msg === 'undefined'
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.stopImmediatePropagation();
                      return false;
                    }
                  } catch (err) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }
                
                // Rejection handler - MUST use capture phase
                function suppressRejection(e) {
                  try {
                    const reason = e.reason;
                    if (reason === undefined || reason === null) {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                    
                    const msg = (
                      typeof reason === 'string' 
                        ? reason 
                        : (reason?.message || reason?.stack || reason?.toString() || String(reason) || '')
                    ).toLowerCase();
                    
                    if (
                      msg.includes('telemetry') ||
                      msg.includes('failed to execute') ||
                      msg.includes('@base-org/account') ||
                      msg.includes('initcca') ||
                      msg === 'undefined' ||
                      msg === 'null' ||
                      !msg ||
                      !msg.trim()
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                  } catch (err) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }
                
                // Register handlers with capture phase (runs first)
                window.addEventListener('error', suppressError, { capture: true, passive: false });
                window.addEventListener('unhandledrejection', suppressRejection, { capture: true, passive: false });
                
                // Also prevent script execution
                if (document.createElement) {
                  const origCreateElement = document.createElement.bind(document);
                  document.createElement = function(tagName, options) {
                    const el = origCreateElement(tagName, options);
                    if (tagName.toLowerCase() === 'script') {
                      const origSetAttribute = el.setAttribute.bind(el);
                      el.setAttribute = function(name, value) {
                        if (name === 'src' && value && typeof value === 'string' && value.toLowerCase().includes('telemetry')) {
                          return;
                        }
                        return origSetAttribute(name, value);
                      };
                    }
                    return el;
                  };
                }
              })();
            `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
