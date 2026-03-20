export const UI_TEXTS = {
  app: {
    title: "Portal de Validación Biométrica",
    footer: "Banco - Ambiente QA - Validación biométrica segura"
  },
  loading: {
    initialTitle: "Validando enlace seguro...",
    initialMessage:
      "Por favor espera mientras verificamos la vigencia de tu enlace.",
    creatingLivenessTitle: "Preparando validación biométrica...",
    creatingLivenessMessage:
      "Estamos creando una sesión segura de verificación. Esto puede tomar unos segundos.",
    validatingTitle: "Validando tu identidad...",
    validatingMessage:
      "Estamos confirmando tu identidad con nuestros sistemas biométricos."
  },
  sessionInvalid: {
    title: "Enlace no válido o expirado",
    message1: "Este enlace ya no es válido o ha expirado.",
    message2: "Solicita un nuevo enlace desde WhatsApp."
  },
  missingSession: {
    title: "Parámetro de sesión faltante",
    message1:
      "Este enlace no contiene la información necesaria para continuar."
  },
  intro: {
    title: "Validación biométrica",
    description:
      "Antes de continuar, por favor lee estas recomendaciones para tomar la captura de tu rostro:",
    hints: {
      goodLight: "Busca un lugar con buena iluminación.",
      lookStraight: "Mira de frente a la cámara.",
      holdSteady: "Sostén el dispositivo de forma estable.",
      dontCover: "Evita cubrir tu rostro con gafas oscuras, gorra o mascarilla."
    },
    continueButton: "Continuar"
  },
  liveness: {
    title: "Captura biométrica",
    subtitle: "Sigue las instrucciones en pantalla y completa el proceso.",
    helper:
      "Este proceso es seguro y solo se utiliza para validar tu identidad."
  },
  success: {
    title: "Identidad validada correctamente",
    message1: "Tu identidad fue validada correctamente.",
    message2: "Ya puedes volver a WhatsApp para continuar."
  },
  failure: {
    title: "No pudimos validar tu identidad",
    message1: "No pudimos completar la validación de tu identidad.",
    message2: "Vuelve a intentarlo iniciando nuevamente desde WhatsApp."
  },
  technicalError: {
    title: "Ocurrió un error técnico",
    message1: "Ocurrió un error técnico. Por favor intenta más tarde.",
    message2: "Si el problema persiste, solicita un nuevo enlace."
  }
};

