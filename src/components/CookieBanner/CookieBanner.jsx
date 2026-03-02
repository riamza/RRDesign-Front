import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Cookie, X } from "lucide-react";
import "./CookieBanner.css";

const CookieBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookieConsent");
    if (consent === null) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-container">
      <div className="cookie-banner-content">
        <div className="cookie-icon-wrapper">
          <Cookie size={24} className="cookie-icon" />
        </div>
        <div className="cookie-text">
          <h4>{t("cookies.title")}</h4>
          <p>{t("cookies.description")}</p>
        </div>
        <div className="cookie-actions">
          <button onClick={handleDecline} className="cookie-btn decline">
            {t("cookies.decline")}
          </button>
          <button onClick={handleAccept} className="cookie-btn accept">
            {t("cookies.accept")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
