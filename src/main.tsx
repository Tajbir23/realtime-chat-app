import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import Store from "./redux/app/store.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.tsx";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    
    <HelmetProvider>
      <Toaster position="top-center" reverseOrder={false} />
        <Provider store={Store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
    
  </StrictMode>
);
