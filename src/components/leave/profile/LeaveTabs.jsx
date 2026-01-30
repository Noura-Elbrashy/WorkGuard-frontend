function LeaveTabs({ active, onChange }) {
  const tabs = [
    { key: 'summary', label: 'Summary' },
    { key: 'requests', label: 'Requests' },
    { key: 'absence', label: 'Absence' }
  ];

  return (
    <ul className="nav nav-tabs mb-3">
      {tabs.map(t => (
        <li className="nav-item" key={t.key}>
          <button
            className={`nav-link ${active === t.key ? 'active' : ''}`}
            onClick={() => onChange(t.key)}
          >
            {t.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default LeaveTabs;
