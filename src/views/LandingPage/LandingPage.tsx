import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './LandingPage.module.css';
import { generateWebsiteSchema, injectSchema } from '../../utils/schemaMarkup';
import LanguageSwitcher from '../../components/global/LanguageSwitcher';

const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Inject schema.org markup when component mounts
  useEffect(() => {
    const websiteSchema = generateWebsiteSchema();
    injectSchema(websiteSchema);

    // Set page title and meta description for SEO
    document.title = 'Z Social - Connect and Share with Friends';
    
    // Create meta description if it doesn't exist
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Join Z Social to connect with friends, share your thoughts, and stay updated with the latest trends and conversations around the world.');
    
    return () => {
      // Reset title when component unmounts
      document.title = 'Z Social';
    };
  }, []);

  // Update page content when language changes
  useEffect(() => {
    // This effect will run whenever i18n.language changes
    // You can add additional language-specific updates here if needed
  }, [i18n.language]);

  return (
    <div className={styles.landingContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo192.png" alt="Z Social Logo" width="50" height="50" />
          <h1>Z Social</h1>
        </div>
        <div className={styles.headerActions}>
          <LanguageSwitcher />
          <div className={styles.headerButtons}>
            <Link to="/login" className={styles.loginButton}>{t('auth.login')}</Link>
            <Link to="/register" className={styles.registerButton}>{t('auth.register')}</Link>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Z Social - {t('landing.heroTitle')}</h1>
            <p>{t('landing.heroSubtitle')}</p>
            <Link to="/register" className={styles.ctaButton}>
              {t('landing.getStarted')}
            </Link>
          </div>
          <div className={styles.heroImage}>
            <img 
              src="/logo192.png" 
              alt="Z Social Platform Preview" 
              loading="lazy"
              width="300"
              height="300"
            />
          </div>
        </section>

        <section className={styles.features}>
          <h2>{t('landing.featuresTitle')}</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>{t('landing.feature1Title')}</h3>
              <p>{t('landing.feature1Desc')}</p>
            </div>
            <div className={styles.featureCard}>
              <h3>{t('landing.feature2Title')}</h3>
              <p>{t('landing.feature2Desc')}</p>
            </div>
            <div className={styles.featureCard}>
              <h3>{t('landing.feature3Title')}</h3>
              <p>{t('landing.feature3Desc')}</p>
            </div>
            <div className={styles.featureCard}>
              <h3>{t('landing.feature4Title')}</h3>
              <p>{t('landing.feature4Desc')}</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>{t('landing.ctaTitle')}</h2>
          <p>{t('landing.ctaText')}</p>
          <Link to="/register" className={styles.ctaButton}>
            {t('landing.joinNow')}
          </Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Z Social. {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
