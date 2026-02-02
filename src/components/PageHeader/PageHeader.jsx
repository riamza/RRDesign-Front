import React from 'react';
import './PageHeader.css';

const PageHeader = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  buttonIcon: ButtonIcon,
  buttonClassName = 'btn-primary',
  wrapperClassName = ''
}) => {
  return (
    <div className={`page-header-wrapper ${wrapperClassName}`}>
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            {Icon && <Icon size={32} />}
            {title}
          </h1>
          {description && <p>{description}</p>}
        </div>
        {buttonText && (
          <div className="page-header-actions">
            <button className={buttonClassName} onClick={onButtonClick}>
              {ButtonIcon && <ButtonIcon size={20} />}
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
