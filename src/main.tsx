import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import Store from "./redux/app/store.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </StrictMode>
);
