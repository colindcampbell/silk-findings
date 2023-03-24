import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { worker } from "./backend/api";
import "./styles/index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    retry: 2,
    cacheTime: 1000 * 60 * 10, // 10 minutes
    refetchIntervalInBackground: false,
    staleTime: 1000 * 60 * 5, // 5 minutes it's stale
  },
});

worker.start({
  quiet: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);
