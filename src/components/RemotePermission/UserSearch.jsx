import { useTranslation } from 'react-i18next';

function UserSearch({ 
  searchQuery, 
  handleSearchUsers, 
  users, 
  isSearching, 
  onSelectUser,
  selectedUsers = [],
  multiSelect = false,
  disabled = false
}) {
  const { t } = useTranslation();

  return (
    <div className="search-box">
      <div className="position-relative">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder={t('searchEmployees')}
          value={searchQuery}
          onChange={(e) => handleSearchUsers(e.target.value)}
          disabled={disabled}
        />
        <span className="search-icon">
          <i className="fas fa-search"></i>
        </span>
      </div>

      {/* Search Results Dropdown */}
      {users.length > 0 && (
        <div className="search-results">
          {users.map(user => {
            const isSelected = multiSelect && selectedUsers.find(u => u._id === user._id);
            
            return (
              <div
                key={user._id}
                className={`search-result-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectUser(user)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-semibold">{user.name}</div>
                    <div className="text-muted small">{user.email}</div>
                  </div>
                  {isSelected && (
                    <i className="fas fa-check-circle text-primary"></i>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-3 text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
          {t('searching')}
        </div>
      )}

      {/* No Results */}
      {searchQuery.length >= 2 && users.length === 0 && !isSearching && (
        <div className="text-center py-3 text-muted small">
          <i className="fas fa-search me-2"></i>
          {t('noResultsFound')}
        </div>
      )}
    </div>
  );
}

export default UserSearch;