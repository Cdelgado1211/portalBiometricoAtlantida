import { useEffect, useMemo, useState } from "react";
import {
  BiometricUiState,
  KnownErrorType,
  RekognitionSessionInfo
} from "../types/biometric";
import {
  createLivenessSession,
  resolveBiometricSession,
  validateIdentity
} from "../services/biometricApi";
import { getQueryParam } from "../utils/url";

interface UseBiometricFlowResult {
  uiState: BiometricUiState;
  isLoading: boolean;
  errorType: KnownErrorType;
  biometricSessionId: string | null;
  rekognitionSession: RekognitionSessionInfo | null;
  progress: number;
  handleStartLiveness: () => void;
  handleLivenessComplete: () => void;
  handleLivenessError: (error: Error | string) => void;
  handleRetry: () => void;
}

export const useBiometricFlow = (): UseBiometricFlowResult => {
  const [uiState, setUiState] = useState<BiometricUiState>(
    BiometricUiState.INITIAL_LOADING
  );
  const [errorType, setErrorType] = useState<KnownErrorType>(null);
  const [biometricSessionId, setBiometricSessionId] = useState<string | null>(
    null
  );
  const [rekognitionSession, setRekognitionSession] =
    useState<RekognitionSessionInfo | null>(null);

  const isLoading =
    uiState === BiometricUiState.INITIAL_LOADING ||
    uiState === BiometricUiState.CREATING_LIVENESS_SESSION ||
    uiState === BiometricUiState.VALIDATING;

  const progress = useMemo(() => {
    switch (uiState) {
      case BiometricUiState.INITIAL_LOADING:
      case BiometricUiState.MISSING_SESSION_PARAM:
      case BiometricUiState.SESSION_INVALID:
        return 10;
      case BiometricUiState.INTRO:
        return 25;
      case BiometricUiState.CREATING_LIVENESS_SESSION:
        return 40;
      case BiometricUiState.CAPTURING:
        return 70;
      case BiometricUiState.VALIDATING:
        return 85;
      case BiometricUiState.SUCCESS:
      case BiometricUiState.FAILED:
        return 100;
      case BiometricUiState.ERROR:
      default:
        return 50;
    }
  }, [uiState]);

  useEffect(() => {
    const search = window.location.search;
    const sessionId = getQueryParam("session", search);

    if (!sessionId) {
      setBiometricSessionId(null);
      setUiState(BiometricUiState.MISSING_SESSION_PARAM);
      return;
    }

    setBiometricSessionId(sessionId);
    setUiState(BiometricUiState.INITIAL_LOADING);

    resolveBiometricSession(sessionId)
      .then((response) => {
        if (!response.ok || response.valid === false) {
          setUiState(BiometricUiState.SESSION_INVALID);
          setErrorType("session-invalid");
          return;
        }

        if (response.status !== "PENDING" && response.status !== "LIVENESS_CREATED") {
          setUiState(BiometricUiState.SESSION_INVALID);
          setErrorType("session-invalid");
          return;
        }

        setUiState(BiometricUiState.INTRO);
        setErrorType(null);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Error resolving biometric session", error);
        setUiState(BiometricUiState.ERROR);
        setErrorType("network");
      });
  }, []);

  const handleStartLiveness = () => {
    if (!biometricSessionId) {
      setUiState(BiometricUiState.MISSING_SESSION_PARAM);
      return;
    }

    setUiState(BiometricUiState.CREATING_LIVENESS_SESSION);
    setErrorType(null);

    createLivenessSession(biometricSessionId)
      .then((response) => {
        if (!response.ok || !response.session_id) {
          setUiState(BiometricUiState.ERROR);
          setErrorType("backend");
          return;
        }

        const sessionInfo: RekognitionSessionInfo = {
          sessionId: response.session_id,
          region: response.region
        };
        setRekognitionSession(sessionInfo);
        setUiState(BiometricUiState.CAPTURING);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Error creating liveness session", error);
        setUiState(BiometricUiState.ERROR);
        setErrorType("network");
      });
  };

  const handleLivenessComplete = () => {
    if (!biometricSessionId || !rekognitionSession) {
      setUiState(BiometricUiState.ERROR);
      setErrorType("unexpected");
      return;
    }

    setUiState(BiometricUiState.VALIDATING);
    setErrorType(null);

    validateIdentity(biometricSessionId, rekognitionSession.sessionId)
      .then((response) => {
        if (!response.ok) {
          setUiState(BiometricUiState.ERROR);
          setErrorType("backend");
          return;
        }

        if (response.validated) {
          setUiState(BiometricUiState.SUCCESS);
        } else {
          setUiState(BiometricUiState.FAILED);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error("Error validating identity", error);
        setUiState(BiometricUiState.ERROR);
        setErrorType("network");
      });
  };

  const handleLivenessError = (error: Error | string) => {
    // eslint-disable-next-line no-console
    console.error("Liveness error", error);
    setUiState(BiometricUiState.ERROR);
    setErrorType("backend");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return {
    uiState,
    isLoading,
    errorType,
    biometricSessionId,
    rekognitionSession,
    progress,
    handleStartLiveness,
    handleLivenessComplete,
    handleLivenessError,
    handleRetry
  };
};
