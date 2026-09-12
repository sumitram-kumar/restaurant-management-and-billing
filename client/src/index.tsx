import React from "react";
import ReactDOM from "react-dom/client";
import "./components/styles/index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthTokenBridge } from "./auth/AuthTokenBridge";
import { CatalogProvider } from "./context/CatalogContext";
import { BillProvider } from "./context/BillContext";
import { ColorModeProvider } from "./context/ColorModeContext";

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

if (!domain || !clientId || !audience) {
  throw new Error(
    "Missing REACT_APP_AUTH0_DOMAIN / REACT_APP_AUTH0_CLIENT_ID / REACT_APP_AUTH0_AUDIENCE. Copy client/.env.example to client/.env and fill them in."
  );
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience,
        // On a GitHub Pages project site the app is served from a subpath
        // (e.g. /restaurant-management-and-billing/), which
        // window.location.origin alone doesn't include. CRA sets
        // PUBLIC_URL from package.json's "homepage" at build time.
        redirect_uri: window.location.origin + process.env.PUBLIC_URL,
      }}
    >
      <ColorModeProvider>
        <AuthTokenBridge />
        <CatalogProvider>
          <BillProvider>
            <App />
          </BillProvider>
        </CatalogProvider>
      </ColorModeProvider>
    </Auth0Provider>
  </React.StrictMode>
);
