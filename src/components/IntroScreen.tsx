import React from "react";
import styles from "../styles/Screen.module.css";
import { UI_TEXTS } from "../constants/texts";

interface IntroScreenProps {
  onContinue: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue }) => {
  return (
    <div className={styles.screenContainer}>
      <h2 className={styles.title}>{UI_TEXTS.intro.title}</h2>
      <p className={styles.message}>{UI_TEXTS.intro.description}</p>
      <ul className={styles.list}>
        <li>{UI_TEXTS.intro.hints.goodLight}</li>
        <li>{UI_TEXTS.intro.hints.lookStraight}</li>
        <li>{UI_TEXTS.intro.hints.holdSteady}</li>
        <li>{UI_TEXTS.intro.hints.dontCover}</li>
      </ul>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={onContinue}
      >
        {UI_TEXTS.intro.continueButton}
      </button>
    </div>
  );
};

