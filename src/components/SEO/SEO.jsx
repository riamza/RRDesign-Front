import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SEO = ({ title, description, keywords, image, url, type = 'website' }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'ro';

  const siteTitle = 'RRDesign - Software Solutions';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  const defaultDescription = t('seo.defaultDescription', 'RRDesign oferă soluții software complete: site-uri de prezentare, magazine online, aplicații web și mobile.');
  const metaDescription = description || defaultDescription;
  
  const defaultKeywords = t('seo.defaultKeywords', 'software, web design, dezvoltare aplicatii, magazin online, site prezentare, seo');
  const metaKeywords = keywords || defaultKeywords;
  
  const metaImage = image || '/og-image.jpg';
  const metaUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Dynamic Native Language */}
      <html lang={currentLang} />
      
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:locale" content={currentLang === 'ro' ? 'ro_RO' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
};

export default SEO;
