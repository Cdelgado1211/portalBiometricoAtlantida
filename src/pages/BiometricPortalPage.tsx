import React from "react";
import { useBiometricFlow } from "../hooks/useBiometricFlow";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorScreen } from "../components/ErrorScreen";
import { IntroScreen } from "../components/IntroScreen";
import { LivenessStep } from "../components/LivenessStep";
import { SuccessScreen } from "../components/SuccessScreen";
import { FailureScreen } from "../components/FailureScreen";
import { ProgressBar } from "../components/ProgressBar";
import { BiometricUiState } from "../types/biometric";
import layoutStyles from "../styles/Layout.module.css";
import { UI_TEXTS } from "../constants/texts";

export const BiometricPortalPage: React.FC = () => {
  const {
    uiState,
    isLoading,
    errorType,
    handleStartLiveness,
    handleLivenessComplete,
    handleLivenessError,
    handleRetry,
    biometricSessionId,
    rekognitionSession,
    progress
  } = useBiometricFlow();

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingScreen
          title={UI_TEXTS.loading.initialTitle}
          message={UI_TEXTS.loading.initialMessage}
        />
      );
    }

    switch (uiState) {
      case BiometricUiState.SESSION_INVALID:
        return (
          <ErrorScreen
            title={UI_TEXTS.sessionInvalid.title}
            messageLines={[
              UI_TEXTS.sessionInvalid.message1,
              UI_TEXTS.sessionInvalid.message2
            ]}
            onRetry={handleRetry}
            showRetry={false}
          />
        );
      case BiometricUiState.MISSING_SESSION_PARAM:
        return (
          <ErrorScreen
            title={UI_TEXTS.missingSession.title}
            messageLines={[UI_TEXTS.missingSession.message1]}
            onRetry={handleRetry}
            showRetry={false}
          />
        );
      case BiometricUiState.INTRO:
        return <IntroScreen onContinue={handleStartLiveness} />;
      case BiometricUiState.CREATING_LIVENESS_SESSION:
        return (
          <LoadingScreen
            title={UI_TEXTS.loading.creatingLivenessTitle}
            message={UI_TEXTS.loading.creatingLivenessMessage}
          />
        );
      case BiometricUiState.CAPTURING:
        if (!rekognitionSession || !biometricSessionId) {
          return (
            <ErrorScreen
              title={UI_TEXTS.technicalError.title}
              messageLines={[UI_TEXTS.technicalError.message1]}
              onRetry={handleRetry}
              showRetry
            />
          );
        }
        return (
          <LivenessStep
            biometricSessionId={biometricSessionId}
            rekognitionSession={rekognitionSession}
            onComplete={handleLivenessComplete}
            onError={handleLivenessError}
          />
        );
      case BiometricUiState.VALIDATING:
        return (
          <LoadingScreen
            title={UI_TEXTS.loading.validatingTitle}
            message={UI_TEXTS.loading.validatingMessage}
          />
        );
      case BiometricUiState.SUCCESS:
        return (
          <SuccessScreen
            title={UI_TEXTS.success.title}
            messageLines={[
              UI_TEXTS.success.message1,
              UI_TEXTS.success.message2
            ]}
          />
        );
      case BiometricUiState.FAILED:
        return (
          <FailureScreen
            title={UI_TEXTS.failure.title}
            messageLines={[
              UI_TEXTS.failure.message1,
              UI_TEXTS.failure.message2
            ]}
            onRetry={handleRetry}
          />
        );
      case BiometricUiState.ERROR:
      default:
        return (
          <ErrorScreen
            title={UI_TEXTS.technicalError.title}
            messageLines={[
              UI_TEXTS.technicalError.message1,
              errorType ? UI_TEXTS.technicalError.message2 : ""
            ].filter(Boolean)}
            onRetry={handleRetry}
            showRetry
          />
        );
    }
  };

  return (
    <div className={layoutStyles.appContainer}>
      <header className={layoutStyles.header}>
        <h1 className={layoutStyles.appTitle}>
          {UI_TEXTS.app.title}
        </h1>
        <p className={layoutStyles.envBadge}>Ambiente: QA</p>
      </header>
      <main className={layoutStyles.mainContent}>
        <ProgressBar progress={progress} />
        <section className={layoutStyles.card}>{renderContent()}</section>
      </main>
      <footer className={layoutStyles.footer}>
        <p className={layoutStyles.footerText}>
          {UI_TEXTS.app.footer}
        </p>
      </footer>
    </div>
  );
};

