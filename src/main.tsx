import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import Store from "./redux/app/store.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    
    <Provider store={Store}>
    <RouterProvider router={router} />
    </Provider>
    
  </StrictMode>
);
