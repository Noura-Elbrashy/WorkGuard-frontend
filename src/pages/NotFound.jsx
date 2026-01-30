
import { useTranslation } from 'react-i18next';
function NotFound() {
    const { t } = useTranslation();


  return (
    <div className="container mt-4 text-center">
  
    <h2>{t("common.notfoundPageH")}</h2>
          <p>{t("common.notfoundpageP")}</p>

    </div>


  );
}

export default NotFound;