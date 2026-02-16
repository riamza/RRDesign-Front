import React from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import Card from "../Card/Card";
import { getIcon } from "../../utils/iconMapper";
import "./ServiceCard.css";

const ServiceCard = ({ service, isAdmin = false, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <Card className="service-card-full">
      {service.price !== undefined && service.price !== null && (
        <div className="service-price-ribbon">
          {Number(service.price) === 0
            ? t("common.free")
            : `${service.price} RON`}
        </div>
      )}

      <div className="service-section service-header">
        <div className="service-icon-large">{getIcon(service.icon, 48)}</div>
        <h3 className="card-title">{service.title}</h3>
      </div>
      <div className="service-section service-description">
        <p className="card-description">{service.description}</p>
      </div>

      <div className="service-section service-features">
        <h4>{t("services.whatWeOffer")}</h4>
        <ul className="card-features">
          {(service.features || []).map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="service-section service-tech">
        <h4>{t("services.recommendedFor")}</h4>
        <ul className="card-features tech-list">
          {(service.recommendedFor || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {isAdmin && (
        <div className="service-actions">
          <button className="btn-card-edit" onClick={() => onEdit(service)}>
            <Pencil size={16} /> {t("dashboard.servicesManager.edit")}
          </button>
          <button className="btn-card-delete" onClick={() => onDelete(service)}>
            <Trash2 size={16} /> {t("dashboard.servicesManager.delete")}
          </button>
        </div>
      )}
    </Card>
  );
};

export default ServiceCard;
