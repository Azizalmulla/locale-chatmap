
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Import publishable key from environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY || ''}
    afterSignInUrl="/setup"
    afterSignUpUrl="/setup"
  >
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  </ClerkProvider>
);
