import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./font.css"
// ** Router Import
import Router from "./router/Router";
import { Toaster } from "react-hot-toast";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <Router />
      </Suspense>
    </QueryClientProvider>
  );
};

export default App;