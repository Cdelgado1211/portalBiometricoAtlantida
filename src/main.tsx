import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/global.css";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      identityPoolId: "us-east-1:bac71bc9-7868-4d38-a967-2434283e0bf0",
      allowGuestAccess: true,
      region: "us-east-1"
    }
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
