import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Contact.css';
import Button from '../../components/Button/Button';
import { companyInfo } from '../../utils/constants';
import SEO from '../../components/SEO/SEO';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aici va fi logica de trimitere a formularului
    alert(t('contact.form.successMessage'));
    console.log('Form data:', formData);
  };

  return (
    <div className="contact-page">
      <SEO 
        title={t('seo.contact.title')} 
        description={t('seo.contact.description')} 
      />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('contact.pageTitle')}</h1>
          <p className="page-description">
            {t('contact.pageDescription')}
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>{t('contact.info.title')}</h2>
              <p className="contact-intro">
                {t('contact.info.description')}
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon"><Mail size={24} /></div>
                  <div>
                    <h4>{t('contact.info.email')}</h4>
                    <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon"><Phone size={24} /></div>
                  <div>
                    <h4>{t('contact.info.phone')}</h4>
                    <a href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}>{companyInfo.phone}</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon"><MapPin size={24} /></div>
                  <div>
                    <h4>{t('contact.info.address')}</h4>
                    <p>{companyInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <form onSubmit={handleSubmit} className="contact-form">
                <h2>{t('contact.form.title')}</h2>

                <div className="form-group">
                  <label htmlFor="name">{t('contact.form.fullName')} {t('contact.form.required')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('contact.form.email')} {t('contact.form.required')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t('contact.form.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('contact.form.phonePlaceholder')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company">{t('contact.form.company')}</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('contact.form.companyPlaceholder')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t('contact.form.message')} {t('contact.form.required')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                <Button type="submit" variant="primary">
                  {t('contact.form.submit')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
