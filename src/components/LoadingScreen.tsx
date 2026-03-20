import React from "react";
import styles from "../styles/Screen.module.css";

interface LoadingScreenProps {
  title: string;
  message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title,
  message
}) => {
  return (
    <div className={styles.screenContainer}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      <div className={styles.spinner} aria-hidden="true" />
    </div>
  );
};

