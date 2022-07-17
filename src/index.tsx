import { BrowserRouter } from "react-router-dom";
import AppRouter from './AppRouter';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/shared/styles/index.scss';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </BrowserRouter>
);
{/* <React.StrictMode></React.StrictMode> */}