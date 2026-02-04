import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, LayoutDashboard, LogOut, FolderKanban, MessageSquare, X } from 'lucide-react';
import './Header.css';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Logo from '../Logo/Logo';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/stringUtils';

const Header = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <NavLink to="/" className="logo">
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

        {/* Desktop Nav */}
        <nav className="nav desktop-nav">
          <NavLink to="/" className="nav-link">{t('header.home')}</NavLink>
          <NavLink to="/services" className="nav-link">{t('header.services')}</NavLink>
          <NavLink to="/projects" className="nav-link">{t('header.projects')}</NavLink>
          <NavLink to="/templates" className="nav-link">{t('header.templates')}</NavLink>
          <NavLink to="/contact" className="nav-link">{t('header.contact')}</NavLink>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-avatar-btn" 
                onClick={toggleDropdown}
                aria-label="User menu"
              >
                <div className="avatar-circle">
                  {getInitials(user?.fullName)}
                </div>
              </button>
              {isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="avatar-circle-large">
                      {getInitials(user?.fullName)}
                    </div>
                    <div className="user-info-dropdown">
                      <p className="user-name">{user?.fullName}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <NavLink to="/profile" className="dropdown-item" onClick={closeDropdown}>
                    <span className="dropdown-icon"><User size={18} /></span>
                    <span>{t('header.profile')}</span>
                  </NavLink>
                  <NavLink to="/my-projects" className="dropdown-item" onClick={closeDropdown}>
                    <span className="dropdown-icon"><FolderKanban size={18} /></span>
                    <span>{t('header.myProjects')}</span>
                  </NavLink>
                  <NavLink to="/messages" className="dropdown-item" onClick={closeDropdown}>
                    <span className="dropdown-icon"><MessageSquare size={18} /></span>
                    <span>{t('header.messages')}</span>
                  </NavLink>
                  {user?.role === 'Admin' && (
                    <>
                      <div className="dropdown-divider"></div>
                      <NavLink to="/dashboard" className="dropdown-item" onClick={closeDropdown}>
                        <span className="dropdown-icon"><LayoutDashboard size={18} /></span>
                        <span>{t('header.dashboard')}</span>
                      </NavLink>
                    </>
                  )}
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout-item" onClick={() => { logout(); closeDropdown(); }} role="button" tabIndex={0}>
                    <span className="dropdown-icon"><LogOut size={18} /></span>
                    <span>{t('header.logout')}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="nav-link login-btn">Login</NavLink>
          )}
        </nav>

        {isMenuOpen && createPortal(
          <>
            <div className="overlay" onClick={closeMenu}></div>
            <nav className="mobile-nav">
              <button className={`burger-menu mobile-close-btn open`} onClick={closeMenu}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <div className="mobile-nav-content">
                {isAuthenticated && (
                  <>
                <div className="mobile-user-info">
                  <div className="user-details centered-details">
                    <span className="user-name">{user?.fullName}</span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                </div>
                <div className="mobile-nav-divider"></div></>)}
                <NavLink to="/" className="nav-link" onClick={closeMenu}>{t('header.home')}</NavLink>
                <NavLink to="/services" className="nav-link" onClick={closeMenu}>{t('header.services')}</NavLink>
                <NavLink to="/projects" className="nav-link" onClick={closeMenu}>{t('header.projects')}</NavLink>
                <NavLink to="/templates" className="nav-link" onClick={closeMenu}>{t('header.templates')}</NavLink>
                <NavLink to="/contact" className="nav-link" onClick={closeMenu}>{t('header.contact')}</NavLink>
                
                <div className="mobile-nav-divider"></div>
                
                {isAuthenticated ? (
                  <>
                     <NavLink to="/profile" className="nav-link" onClick={closeMenu}>
                        <User size={18} /> {t('header.profile')}
                     </NavLink>
                     <NavLink to="/my-projects" className="nav-link" onClick={closeMenu}>
                        <FolderKanban size={18} /> {t('header.myProjects')}
                     </NavLink>
                     <NavLink to="/messages" className="nav-link" onClick={closeMenu}>
                        <MessageSquare size={18} /> {t('header.messages')}
                     </NavLink>
                     {user?.role === 'Admin' && (
                        <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
                          <LayoutDashboard size={18} /> {t('header.dashboard')}
                        </NavLink>
                     )}
                     <div className="mobile-nav-bottom-spacer"></div>
                     <div className="nav-link logout-link bottom-logout" onClick={() => { logout(); closeMenu(); }} role="button">
                        <LogOut size={18} /> {t('header.logout')}
                     </div>
                  </>
                ) : (
                   <NavLink to="/login" className="nav-link login-btn" onClick={closeMenu}>Login</NavLink>
                )}
                
                <div className="mobile-nav-footer">
                  <LanguageSwitcher />
                </div>
              </div>
            </nav>
          </>,
          document.body
        )}
      </div>
    </header>
  );
};

export default Header;
