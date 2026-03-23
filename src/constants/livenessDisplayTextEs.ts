import type { LivenessDisplayText } from "@aws-amplify/ui-react-liveness";

export const LIVENESS_DISPLAY_TEXT_ES: LivenessDisplayText = {
  // Instrucciones principales
  hintCenterFaceText: "Centra tu rostro",
  hintCenterFaceInstructionText:
    "Antes de comenzar, coloca la cámara al centro superior de la pantalla y centra tu rostro. Cuando inicie la prueba verás un óvalo; acércate hasta quedar dentro del óvalo y luego mantente quieto.",
  hintFaceOffCenterText:
    "Tu rostro no está dentro del óvalo. Centra tu rostro frente a la cámara.",

  // Indicaciones durante la prueba
  hintMoveFaceFrontOfCameraText: "Coloca tu rostro frente a la cámara",
  hintTooFarText: "Acércate un poco más",
  hintTooCloseText: "Aléjate un poco",
  hintConnectingText: "Conectando...",
  hintVerifyingText: "Verificando...",
  hintCheckCompleteText: "Verificación completada",
  hintHoldFaceForFreshnessText: "Mantente quieto",

  // Advertencia de fotosensibilidad
  photosensitivityWarningHeadingText: "Advertencia de fotosensibilidad",
  photosensitivityWarningBodyText:
    "Esta prueba utiliza luces de diferentes colores. Ten precaución si eres fotosensible.",
  photosensitivityWarningInfoText:
    "Algunas personas pueden experimentar convulsiones epilépticas al exponerse a luces intermitentes o de colores. Ten cuidado si tú o alguien de tu familia tiene alguna condición epiléptica.",
  photosensitivityWarningLabelText: "Más información sobre fotosensibilidad",

  // Mensajes de cámara
  waitingCameraPermissionText:
    "Esperando que autorices el acceso a la cámara.",
  retryCameraPermissionsText: "Reintentar",

  // Pantalla inicial
  startScreenBeginCheckText: "Iniciar verificación en video",
};
