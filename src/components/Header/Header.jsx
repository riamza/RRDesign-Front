import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, LayoutDashboard, LogOut, FolderKanban, MessageSquare } from 'lucide-react';
import './Header.css';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Logo from '../Logo/Logo';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
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

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="header">
      <div className="container">
        <NaLogo className="logo-svg" /efs>
          </svg>
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
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-avatar-btn" 
                onClick={toggleDropdown}
                aria-label="User menu"
              >
                <div className="avatar-circle">
                  {getInitials(user?.name)}
                </div>
              </button>
              {isDropdownOpen && (
                <>
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="avatar-circle-large">
                        {getInitials(user?.name)}
                      </div>
                      <div className="user-info-dropdown">
                        <p className="user-name">{user?.name}</p>
                        <p className="user-email">{user?.email}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <NavLink 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => { closeDropdown(); closeMenu(); }}
                    >
                      <span className="dropdown-icon"><User size={18} /></span>
                      <span>{t('header.profile')}</span>
                    </NavLink>
                    <NavLink 
                      to="/my-projects" 
                      className="dropdown-item"
                      onClick={() => { closeDropdown(); closeMenu(); }}
                    >
                      <span className="dropdown-icon"><FolderKanban size={18} /></span>
                      <span>{t('header.myProjects')}</span>
                    </NavLink>
                    <NavLink 
                      to="/messages" 
                      className="dropdown-item"
                      onClick={() => { closeDropdown(); closeMenu(); }}
                    >
                      <span className="dropdown-icon"><MessageSquare size={18} /></span>
                      <span>{t('header.messages')}</span>
                    </NavLink>
                    {user?.role === 'admin' && (
                      <>
                        <div className="dropdown-divider"></div>
                        <NavLink 
                          to="/dashboard" 
                          className="dropdown-item"
                          onClick={() => { closeDropdown(); closeMenu(); }}
                        >
                          <span className="dropdown-icon"><LayoutDashboard size={18} /></span>
                          <span>{t('header.dashboard')}</span>
                        </NavLink>
                      </>
                    )}
                    <div className="dropdown-divider"></div>
                    <NavLink 
                      to="/logout" 
                      className="dropdown-item logout-item"
                      onClick={() => { closeDropdown(); closeMenu(); }}
                    >
                      <span className="dropdown-icon"><LogOut size={18} /></span>
                      <span>{t('header.logout')}</span>
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="nav-link login-btn" onClick={closeMenu}>Login</NavLink>
          )}
        </nav>

        {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
      </div>
    </header>
  );
};

export default Header;
