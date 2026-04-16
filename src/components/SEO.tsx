import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/og-image.png',
  url = 'https://dev-hustlers-website.vercel.app',
  type = 'website',
}) => {
  const { t, locale } = useLanguage();

  const seoTitle = title || t('seo.title');
  const seoDescription = description || t('seo.description');
  const seoKeywords = keywords || t('seo.keywords');
  const siteName = 'DevHustlers';

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": url,
    "logo": `${url}/logo.png`,
    "description": t('seo.description'),
    "sameAs": [
      "https://twitter.com/devhustlers",
      "https://github.com/devhustlers"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Worldwide",
      "addressCountry": "Global"
    }
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={siteName} />
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={image.startsWith('http') ? image : `${url}${image}`} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `${url}${image}`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Language Alternates */}
      <link rel="alternate" href={`${url}/en`} hrefLang="en" />
      <link rel="alternate" href={`${url}/ar`} hrefLang="ar" />
      <link rel="alternate" href={url} hrefLang="x-default" />
    </Helmet>
  );
};

export default SEO;
