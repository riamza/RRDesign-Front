import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', onClick, href, className = '', ...props }) => {
  const baseClass = `button button-${variant} ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClass} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={baseClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;
