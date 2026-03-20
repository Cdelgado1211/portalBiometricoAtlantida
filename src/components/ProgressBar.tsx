import React from "react";
import styles from "../styles/ProgressBar.module.css";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={styles.progressContainer} aria-hidden="true">
      <div
        className={styles.progressFill}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

