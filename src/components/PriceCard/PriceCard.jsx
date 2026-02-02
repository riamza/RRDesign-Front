import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2 } from 'lucide-react';
import './PriceCard.css';

const PriceCard = ({ pkg, isAdmin = false, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className={`pricing-card ${pkg.highlight ? 'highlight' : ''}`}>
      <div className="pricing-header">
        <h3>{pkg.title}</h3>
        <div className="price">{pkg.price}</div>
        <p className="description">{pkg.description}</p>
      </div>
      <div className="pricing-features">
        <ul>
          {pkg.features.map((feature, index) => (
            <li key={index}>
              <span className="check-icon">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      {!isAdmin && (
        <div className="pricing-action">
          <a href="/contact" className={`button ${pkg.highlight ? 'button-primary' : 'button-secondary'}`}>
            {t('services.pricing.button')}
          </a>
        </div>
      )}

      {isAdmin && (
        <div className="pricing-actions-admin">
           <button className="btn-card-edit" onClick={() => onEdit(pkg)}>
            <Pencil size={16} /> {t('dashboard.pricingManager.edit')}
          </button>
          <button className="btn-card-delete" onClick={() => onDelete(pkg)}>
            <Trash2 size={16} /> {t('dashboard.pricingManager.delete')}
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceCard;
