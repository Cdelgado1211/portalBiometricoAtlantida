export enum BiometricUiState {
  INITIAL_LOADING = "initial-loading",
  SESSION_INVALID = "session-invalid",
  MISSING_SESSION_PARAM = "missing-session-param",
  INTRO = "intro",
  CREATING_LIVENESS_SESSION = "creating-liveness-session",
  CAPTURING = "capturing",
  VALIDATING = "validating",
  SUCCESS = "success",
  FAILED = "failed",
  ERROR = "error"
}

export type KnownErrorType =
  | "network"
  | "backend"
  | "session-invalid"
  | "unexpected"
  | null;

interface BaseActionRequest {
  action: string;
}

export interface ResolveBiometricSessionRequest extends BaseActionRequest {
  biometric_session_id: string;
}

export interface ResolveBiometricSessionResponse {
  ok: boolean;
  biometric_session_id: string;
  collection_id: string;
  status: "PENDING" | "USED" | "EXPIRED" | string;
  valid?: boolean;
  reason?: string;
}

export interface CreateLivenessSessionRequest extends BaseActionRequest {
  biometric_session_id: string;
}

export interface CreateLivenessSessionResponse {
  ok: boolean;
  session_id: string;
  region: string;
}

export interface ValidateIdentityRequest extends BaseActionRequest {
  biometric_session_id: string;
  rekognition_session_id: string;
}

export interface ValidateIdentityResponse {
  ok: boolean;
  validated: boolean;
  status: "VALIDATED" | "FAILED" | string;
  expected_user_id?: string;
  matched_user_id?: string;
  liveness_confidence?: number;
  match_similarity?: number;
  reason?: string;
}

export interface RekognitionSessionInfo {
  sessionId: string;
  region: string;
}
