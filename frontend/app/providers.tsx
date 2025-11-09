'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Ensure error suppression is active before Wagmi initializes
  useEffect(() => {
    // Double-check error handlers are set up
    if (typeof window !== 'undefined') {
      const suppressTelemetryError = (e: ErrorEvent | PromiseRejectionEvent) => {
        const message = (
          (e as ErrorEvent).message || 
          String((e as PromiseRejectionEvent).reason || '') ||
          ''
        ).toLowerCase();
        
        if (
          message.includes('telemetry') ||
          message.includes('@base-org/account') ||
          message.includes('initcca') ||
          message === 'undefined' ||
          !message.trim()
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      // Add additional error handlers
      window.addEventListener('error', suppressTelemetryError as EventListener, { capture: true, passive: false });
      window.addEventListener('unhandledrejection', suppressTelemetryError as EventListener, { capture: true, passive: false });
      
      return () => {
        window.removeEventListener('error', suppressTelemetryError as EventListener, { capture: true });
        window.removeEventListener('unhandledrejection', suppressTelemetryError as EventListener, { capture: true });
      };
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#00c2a8',
            accentColorForeground: 'white',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

