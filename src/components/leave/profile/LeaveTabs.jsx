import { useTranslation } from 'react-i18next';

function LeaveTabs({ active, onChange }) {
const { t } = useTranslation('leave');
const { t: tCommon } = useTranslation('translation');


  const tabs = [
    { key: 'summary', label: t('tabs.summary') },
    { key: 'requests', label: t('tabs.requests') },
    { key: 'absence', label: t('tabs.absence') }
  ];

  return (
    <ul className="nav nav-tabs mb-3">
      {tabs.map(tab => (
        <li className="nav-item" key={tab.key}>
          <button
            className={`nav-link ${active === tab.key ? 'active' : ''}`}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default LeaveTabs;