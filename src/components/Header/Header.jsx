import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <NavLink to="/" className="logo" onClick={closeMenu}>
          <span className="logo-rr">RR</span>
          <span className="logo-design">Design</span>
        </NavLink>
        
        <button 
          className={`burger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={closeMenu}>{t('header.home')}</NavLink>
          <NavLink to="/services" className="nav-link" onClick={closeMenu}>{t('header.services')}</NavLink>
          <NavLink to="/projects" className="nav-link" onClick={closeMenu}>{t('header.projects')}</NavLink>
          <NavLink to="/templates" className="nav-link" onClick={closeMenu}>{t('header.templates')}</NavLink>
          <NavLink to="/contact" className="nav-link" onClick={closeMenu}>{t('header.contact')}</NavLink>
          <LanguageSwitcher />
          <NavLink to="/login" className="nav-link login-btn" onClick={closeMenu}>Login</NavLink>
        </nav>

        {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
      </div>
    </header>
  );
};

export default Header;
