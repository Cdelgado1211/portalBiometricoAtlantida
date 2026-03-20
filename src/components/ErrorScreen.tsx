import React from "react";
import styles from "../styles/Screen.module.css";

interface ErrorScreenProps {
  title: string;
  messageLines: string[];
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title,
  messageLines,
  onRetry,
  showRetry = true
}) => {
  return (
    <div className={styles.screenContainer}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.messageGroup}>
        {messageLines.map((line) => (
          <p key={line} className={styles.message}>
            {line}
          </p>
        ))}
      </div>
      {showRetry && onRetry && (
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onRetry}
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

