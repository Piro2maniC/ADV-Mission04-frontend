import React from "react";
import styles from "../../styles/HomePageFooter.module.css";

function Footer() {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.footerText}>
        Copyright 2024 by David Tolmay All rights resereved
      </div>
    </div>
  );
}

export default Footer;
