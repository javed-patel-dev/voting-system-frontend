import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import App from "./App.tsx";
import "@/styles/globals.css";
import { GlobalErrorBoundary } from "./utils/globalErrorBoundary.tsx";
import { AuthProvider } from "./components/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GlobalErrorBoundary>
    </Provider>
  </StrictMode>
);
