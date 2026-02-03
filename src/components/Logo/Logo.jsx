import React from 'react';
import PropTypes from 'prop-types';

const Logo = ({ width = 40, height = 40, className = '' }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="url(#paint0_linear_logo)" fillOpacity="0.1"/>
      <path d="M12 12H18C20.2091 12 22 13.7909 22 16C22 18.2091 20.2091 20 18 20H15V28H12V12Z" fill="url(#paint0_linear_logo)"/> 
      <path d="M22 20L28 28" stroke="url(#paint0_linear_logo)" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient id="paint0_linear_logo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B6B"/>
          <stop offset="1" stopColor="#FFB84D"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

Logo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

export default Logo;
