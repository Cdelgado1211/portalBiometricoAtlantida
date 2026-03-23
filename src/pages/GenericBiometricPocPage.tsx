import React, { useEffect, useRef, useState } from "react";
import layoutStyles from "../styles/Layout.module.css";
import screenStyles from "../styles/Screen.module.css";
import { createLivenessSessionPoc, validateIdCard } from "../services/biometricApi";
import type { RekognitionSessionInfo, ValidateIdCardResponse } from "../types/biometric";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import "@aws-amplify/ui-react/styles.css";
import styles from "../styles/Liveness.module.css";
import { LIVENESS_DISPLAY_TEXT_ES } from "../constants/livenessDisplayTextEs";

export const GenericBiometricPocPage: React.FC = () => {
  const [idImageBase64, setIdImageBase64] = useState<string | null>(null);
  const [rekognitionSession, setRekognitionSession] =
    useState<RekognitionSessionInfo | null>(null);
  const [isWideLayout, setIsWideLayout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ValidateIdCardResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
    accuracy?: number;
  } | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setIdImageBase64(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : null;
      setIdImageBase64(value);
    };
    reader.readAsDataURL(file);
    // Si el usuario selecciona un archivo, cerramos la cámara si estaba abierta.
    closeCamera();
  };

  const openCamera = async () => {
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Tu navegador no soporta captura de cámara.");
      return;
    }

    try {
      setIsCameraLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      // Primero marcamos la cámara como abierta; el efecto
      // se encargará de vincular el stream al elemento <video>.
      setIsCameraOpen(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error al abrir la cámara", error);
      setCameraError("No se pudo acceder a la cámara.");
    } finally {
      setIsCameraLoading(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setIsCameraLoading(false);
  };

  const handleCaptureFromCamera = () => {
    const video = videoRef.current;
    if (!video) {
      setCameraError("No se encontró el video de la cámara.");
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      setCameraError("La cámara todavía se está inicializando. Intenta de nuevo.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCameraError("No se pudo capturar la imagen.");
      return;
    }

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setIdImageBase64(dataUrl);
    closeCamera();
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      const address = data.address || {};
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality;
      const parts = [
        city,
        address.state,
        address.country,
      ].filter(Boolean) as string[];

      if (parts.length > 0) {
        setLocationLabel(parts.join(", "));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error resolviendo ubicación a ciudad/país", error);
    }
  };

  const requestLocation = () => {
    setLocationError(null);
    setLocationLabel(null);

    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta ubicación.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setLocation(loc);
        void reverseGeocode(loc.lat, loc.lon);
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error("Error obteniendo ubicación", err);
        setLocationError("No se pudo obtener la ubicación.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
      }
    );
  };

  useEffect(() => {
    // Cuando la cámara está abierta y ya tenemos el stream,
    // vinculamos el stream al elemento <video> y damos play.
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current
        .play()
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Error al reproducir el video de la cámara", error);
          setCameraError("No se pudo mostrar el video de la cámara.");
        });
    }
  }, [isCameraOpen]);

  useEffect(() => {
    return () => {
      // Cleanup stream al desmontar el componente.
      closeCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartLiveness = async () => {
    setErrorMessage(null);
    setResult(null);
    // Limpiamos ubicación previa y pedimos la nueva (si el usuario acepta permiso).
    setLocation(null);
    requestLocation();

    if (!idImageBase64) {
      setErrorMessage("Debes seleccionar una imagen de la cédula.");
      return;
    }

    try {
      setIsCreatingSession(true);
      const response = await createLivenessSessionPoc();
      if (!response.ok || !response.session_id) {
        setErrorMessage("No se pudo crear la sesión de liveness.");
        return;
      }

      const sessionInfo: RekognitionSessionInfo = {
        sessionId: response.session_id,
        region: response.region
      };
      setRekognitionSession(sessionInfo);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error creando sesión de liveness (POC)", error);
      setErrorMessage("Ocurrió un error al crear la sesión de liveness.");
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleLivenessComplete = async () => {
    if (!idImageBase64 || !rekognitionSession) {
      setErrorMessage("Faltan datos para validar la cédula.");
      return;
    }

    try {
      // Ocultamos el componente de liveness para que
      // no quede en estado "Verifying..." mientras
      // hacemos la validación en el backend.
      setRekognitionSession(null);

      setIsSubmitting(true);
      const response = await validateIdCard(
        idImageBase64,
        rekognitionSession.sessionId
      );
      setResult(response);
      if (!response.ok) {
        setErrorMessage(response.reason || "La validación no fue exitosa.");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error calling validate_id_card", error);
      setErrorMessage("Ocurrió un error al validar la cédula.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLivenessError = (error: Error | string) => {
    // eslint-disable-next-line no-console
    console.error("Liveness error (POC)", error);
    setErrorMessage("Ocurrió un error durante la captura biométrica.");
  };

  return (
    <div className={layoutStyles.appContainer}>
      <header className={layoutStyles.header}>
        <h1 className={layoutStyles.appTitle}>
          Portal de Biometría - POC
        </h1>
        <p className={layoutStyles.envBadge}>Ambiente: QA</p>
      </header>
      <main className={layoutStyles.mainContent}>
        <section
          className={`${layoutStyles.card} ${
            isWideLayout ? layoutStyles.cardWide : ""
          }`}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.75rem",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <h2 style={{ margin: 0 }}>
              Validación general de identidad (POC)
            </h2>
            <button
              type="button"
              className={screenStyles.secondaryButton}
              onClick={() => setIsWideLayout((prev) => !prev)}
            >
              {isWideLayout ? "Vista móvil" : "Vista escritorio"}
            </button>
          </div>
          <p>
            Esta POC permite validar a la persona de la cédula.
          </p>
          <p>
            1. Sube una foto de la cédula (frontal). <br />
            2. Presiona &quot;Iniciar captura biométrica&quot;. <br />
            3. Te dirá el nivel de confianza y similitud.
          </p>

          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ marginBottom: "0.5rem" }}>
              Foto de la cédula (puedes tomarla o adjuntarla):
            </p>

            {/* Input nativo oculto, disparado por un botón estilizado */}
            <input
              id="id-card-file-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                alignItems: "center",
                marginTop: "0.25rem"
              }}
            >
              <button
                type="button"
                className={screenStyles.secondaryButton}
                onClick={() =>
                  document.getElementById("id-card-file-input")?.click()
                }
              >
                Seleccionar archivo
              </button>

              {!isCameraOpen && (
                <button
                  type="button"
                  onClick={openCamera}
                  disabled={isCameraLoading}
                  className={screenStyles.secondaryButton}
                >
                  {isCameraLoading ? "Abriendo cámara..." : "Tomar foto con cámara"}
                </button>
              )}
            </div>

            {idImageBase64 && (
              <div style={{ marginTop: "1rem" }}>
                <p>Vista previa:</p>
                <img
                  src={idImageBase64}
                  alt="Vista previa de la cédula"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "240px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <div style={{ marginTop: "1rem" }}>
              {isCameraOpen && (
                <div style={{ marginTop: "0.5rem" }}>
                  <video
                    ref={videoRef}
                    style={{
                      width: "100%",
                      maxHeight: "260px",
                      borderRadius: "8px",
                      backgroundColor: "#020617"
                    }}
                    muted
                    playsInline
                  />
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={handleCaptureFromCamera}
                      className={screenStyles.primaryButton}
                    >
                      Capturar foto
                    </button>
                    <button
                      type="button"
                      onClick={closeCamera}
                      className={screenStyles.secondaryButton}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {cameraError && (
              <p style={{ marginTop: "0.5rem", color: "#c00" }}>
                {cameraError}
              </p>
            )}
          </div>

          {!rekognitionSession && (
            <button
              type="button"
              onClick={handleStartLiveness}
              disabled={isCreatingSession}
              className={screenStyles.primaryButton}
            >
              {isCreatingSession ? "Creando sesión..." : "Iniciar captura biométrica"}
            </button>
          )}

          {rekognitionSession && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3>Captura biométrica (POC)</h3>
              <div className={styles.livenessContainer}>
                <div className={styles.detectorWrapper}>
                  <FaceLivenessDetector
                    sessionId={rekognitionSession.sessionId}
                    region={rekognitionSession.region}
                    displayText={LIVENESS_DISPLAY_TEXT_ES}
                    onAnalysisComplete={handleLivenessComplete}
                    onError={handleLivenessError}
                  />
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <p style={{ marginTop: "1rem", color: "#c00" }}>
              {errorMessage}
            </p>
          )}

          {isSubmitting && !errorMessage && (
            <p style={{ marginTop: "1rem" }}>
              Validando cédula...
            </p>
          )}

          {result && result.ok && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                Resultado:{" "}
                <strong
                  style={{
                    color: result.validated ? "#0a7a26" : "#c00"
                  }}
                >
                  {result.validated ? "VALIDADO" : "NO COINCIDE"}
                </strong>
              </p>
              {result.top_similarity !== undefined && (
                <p>
                  Similitud: {result.top_similarity?.toFixed(2)}% (umbral{" "}
                  {result.face_match_threshold ?? "n/a"}%)
                </p>
              )}
              {result.liveness_confidence !== undefined && (
                <p>
                  Confianza de liveness:{" "}
                  {result.liveness_confidence?.toFixed(2)}%
                </p>
              )}
              {location && (
                <p>
                  Ubicación aproximada:{" "}
                  {locationLabel
                    ? locationLabel
                    : `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`}
                </p>
              )}
              {locationError && !location && (
                <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  {locationError}
                </p>
              )}
              {result.reason && (
                <p>Motivo: <code>{result.reason}</code></p>
              )}
            </div>
          )}
        </section>
      </main>
      <footer className={layoutStyles.footer}>
        <p className={layoutStyles.footerText}>
          Portal biométrico de prueba (POC).
        </p>
      </footer>
    </div>
  );
};
