import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Login.css';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1>{t('login.title')}</h1>
            <p>{t('login.subtitle')}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{t('login.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('login.emailPlaceholder')}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('login.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder={t('login.passwordPlaceholder')}
                autoComplete="current-password"
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>{t('login.rememberMe')}</span>
              </label>
              <a href="#" className="forgot-password">{t('login.forgotPassword')}</a>
            </div>

            <Button type="submit" variant="primary" className="login-button">
              {t('login.loginButton')}
            </Button>
          </form>

          <div className="login-footer">
            <p className="demo-credentials">
              <strong>{t('login.demo')}</strong> admin@rrdesign.ro / admin123
            </p>
            <p>{t('login.noAccount')} <a href="/contact">{t('login.contactLink')}</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
