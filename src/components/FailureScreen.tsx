import React from "react";
import styles from "../styles/Screen.module.css";

interface FailureScreenProps {
  title: string;
  messageLines: string[];
  onRetry: () => void;
}

export const FailureScreen: React.FC<FailureScreenProps> = ({
  title,
  messageLines,
  onRetry
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
      <button
        type="button"
        className={styles.primaryButton}
        onClick={onRetry}
      >
        Volver a intentar
      </button>
    </div>
  );
};

