import React from "react";
import styles from "../styles/Screen.module.css";

interface SuccessScreenProps {
  title: string;
  messageLines: string[];
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  title,
  messageLines
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
    </div>
  );
};

