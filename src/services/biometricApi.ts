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
    biometric_session_id: biometricSessionId
  };
  return httpPost<ResolveBiometricSessionRequest, ResolveBiometricSessionResponse>(
    "/session/resolve",
    payload
  );
}

export function createLivenessSession(
  biometricSessionId: string
): Promise<CreateLivenessSessionResponse> {
  const payload: CreateLivenessSessionRequest = {
    biometric_session_id: biometricSessionId
  };
  return httpPost<CreateLivenessSessionRequest, CreateLivenessSessionResponse>(
    "/liveness/create",
    payload
  );
}

export function validateIdentity(
  biometricSessionId: string,
  rekognitionSessionId: string
): Promise<ValidateIdentityResponse> {
  const payload: ValidateIdentityRequest = {
    biometric_session_id: biometricSessionId,
    rekognition_session_id: rekognitionSessionId
  };
  return httpPost<ValidateIdentityRequest, ValidateIdentityResponse>(
    "/identity/validate",
    payload
  );
}

