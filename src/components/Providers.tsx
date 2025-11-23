"use client";

import { ReactNode, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // ⚙️ Performance / UX tuning for token data
            refetchOnWindowFocus: false,
            staleTime: 30_000,   // data considered fresh for 30s
            gcTime: 5 * 60_000,  // garbage-collect cache after 5 minutes
            retry: 1,            // single retry on failure
          },
        },
      })
  );

  const isDev = process.env.NODE_ENV === "development";

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        {isDev && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ReduxProvider>
  );
}
