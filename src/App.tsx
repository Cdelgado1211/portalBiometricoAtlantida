import React from "react";
import { BiometricPortalPage } from "./pages/BiometricPortalPage";
import { GenericBiometricPocPage } from "./pages/GenericBiometricPocPage";
import { getQueryParam } from "./utils/url";

export const App: React.FC = () => {
  const search = window.location.search;
  const sessionId = getQueryParam("session", search);

  if (sessionId) {
    return <BiometricPortalPage />;
  }

  return <GenericBiometricPocPage />;
};

