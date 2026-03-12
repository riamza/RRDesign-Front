import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Cookie, X } from "lucide-react";
import "./CookieBanner.css";

const CookieBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const COOKIE_NAME = "RRDesign_CookieConsent";

  const getConsent = () => {
    const match = document.cookie.match(
      new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)"),
    );
    if (match) return match[2];
    return localStorage.getItem("cookieConsent");
  };

  const setConsent = (value) => {
    const d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year
    document.cookie = `${COOKIE_NAME}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    localStorage.setItem("cookieConsent", value);
    setIsVisible(false);
  };

  useEffect(() => {
    // Check if user has already made a choice
    const consent = getConsent();
    if (!consent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setConsent("true");
  };

  const handleDecline = () => {
    setConsent("false");
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
