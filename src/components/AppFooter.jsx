import { useTranslation } from 'react-i18next';
import '../style/AppFooter.css';

const AppFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        
        {/* Left */}
        <div className="footer-left">
          <span className="footer-brand">WorkGuard</span>
          <span className="footer-divider">•</span>
          <span className="footer-tagline">
            {/* Workforce & HR Management */}
            Workforce Management & Control Platform
          </span>
        </div>

        {/* Center */}
        <div className="footer-center">
          <span>
            © {new Date().getFullYear()} WorkGuard
          </span>
        </div>

        {/* Right */}
        <div className="footer-right">
          <span className="footer-secure">
            <i className="fas fa-shield-alt me-1"></i>
            {/* Secure HR Platform */}
            Secure Workforce Platform

          </span>
        </div>

      </div>
    </footer>
  );
};

export default AppFooter;
