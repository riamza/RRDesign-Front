import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import "./PriceCard.css";

const PriceCard = ({ pkg, isAdmin = false, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRequestOffer = () => {
    navigate("/contact", {
      state: {
        message: t("contact.prefill.package", { title: pkg.title }),
      },
    });
  };

  return (
    <div className={`pricing-card ${pkg.highlight ? "highlight" : ""}`}>
      <div className="pricing-header">
        <h3>{pkg.title}</h3>
        <div className="price">
          {pkg.price}
          <span className="currency"> RON</span>
          {pkg.isMonthly && (
            <span className="price-period">{t("common.periodMonthly")}</span>
          )}
        </div>
        <p className="description">{pkg.description}</p>
      </div>
      <div className="pricing-features">
        <h4>{t("services.pricing.benefits")}</h4>
        <ul className="features-list">
          {pkg.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {pkg.recommendedFor && pkg.recommendedFor.length > 0 && (
        <div className="pricing-recommended">
          <h4>{t("dashboard.pricingManager.recommendedFor")}</h4>
          <ul className="recommended-list">
            {pkg.recommendedFor.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {!isAdmin && (
        <div className="pricing-action">
          <button
            onClick={handleRequestOffer}
            className="button button-primary"
          >
            {t("services.pricing.button")}
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="pricing-actions-admin">
          <button className="btn-card-edit" onClick={() => onEdit(pkg)}>
            <Pencil size={16} /> {t("dashboard.pricingManager.edit")}
          </button>
          <button className="btn-card-delete" onClick={() => onDelete(pkg)}>
            <Trash2 size={16} /> {t("dashboard.pricingManager.delete")}
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceCard;
