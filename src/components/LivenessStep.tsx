import React from "react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import "@aws-amplify/ui-react/styles.css";
import styles from "../styles/Liveness.module.css";
import { RekognitionSessionInfo } from "../types/biometric";
import { UI_TEXTS } from "../constants/texts";

interface LivenessStepProps {
  biometricSessionId: string;
  rekognitionSession: RekognitionSessionInfo;
  onComplete: () => void;
  onError: (error: Error | string) => void;
}

export const LivenessStep: React.FC<LivenessStepProps> = ({
  rekognitionSession,
  onComplete,
  onError
}) => {
  // Nota: se asume que la configuración de credenciales de Amplify/AWS
  // se realiza fuera de este componente.

  return (
    <div className={styles.livenessContainer}>
      <h2 className={styles.title}>{UI_TEXTS.liveness.title}</h2>
      <p className={styles.subtitle}>{UI_TEXTS.liveness.subtitle}</p>
      <div className={styles.detectorWrapper}>
        <FaceLivenessDetector
          sessionId={rekognitionSession.sessionId}
          region={rekognitionSession.region}
          onAnalysisComplete={onComplete}
          onError={(err) => {
            // Propagamos el error real para poder
            // ver el detalle en consola y en logs.
            const normalizedError =
              err instanceof Error ? err : new Error(String(err));
            onError(normalizedError);
          }}
        />
      </div>
      <p className={styles.helperText}>{UI_TEXTS.liveness.helper}</p>
    </div>
  );
};
