import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/HomePageNavbar.module.css";

function HomePageSectionOne() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  function togglemenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.buttonContainer} ${
          isMenuOpen ? styles.showMenu : ""
        }`}
      >
        <div className={styles.leftContainer}>
          <div className={styles.navbarButton} onClick={togglemenu}>
            Find a Car
          </div>
          <div className={styles.navbarButton} onClick={togglemenu}>
            How to Buy
          </div>
          <div className={styles.navbarButton} onClick={togglemenu}>
            Sell your Car
          </div>
          <div className={styles.navbarButton} onClick={() => navigate("/insurance")}>
            Finance & Insurance
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.navbarButton} onClick={togglemenu}>
            Auctions
          </div>
          <div className={styles.navbarButton} onClick={togglemenu}>
            Services & Info
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageSectionOne;
