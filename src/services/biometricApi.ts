import { httpPost } from "./api";
import {
  ResolveBiometricSessionRequest,
  ResolveBiometricSessionResponse,
  CreateLivenessSessionRequest,
  CreateLivenessSessionResponse,
  ValidateIdentityRequest,
  ValidateIdentityResponse
} from "../types/biometric";

export function resolveBiometricSession(
  biometricSessionId: string
): Promise<ResolveBiometricSessionResponse> {
  const payload: ResolveBiometricSessionRequest = {
    action: "resolve_session",
    biometric_session_id: biometricSessionId
  };
  return httpPost<ResolveBiometricSessionRequest, ResolveBiometricSessionResponse>(
    "/",
    payload
  );
}

export function createLivenessSession(
  biometricSessionId: string
): Promise<CreateLivenessSessionResponse> {
  const payload: CreateLivenessSessionRequest = {
    action: "create_liveness_session",
    biometric_session_id: biometricSessionId
  };
  return httpPost<CreateLivenessSessionRequest, CreateLivenessSessionResponse>(
    "/",
    payload
  );
}

export function validateIdentity(
  biometricSessionId: string,
  rekognitionSessionId: string
): Promise<ValidateIdentityResponse> {
  const payload: ValidateIdentityRequest = {
    action: "validate_identity",
    biometric_session_id: biometricSessionId,
    rekognition_session_id: rekognitionSessionId
  };
  return httpPost<ValidateIdentityRequest, ValidateIdentityResponse>(
    "/",
    payload
  );
}
