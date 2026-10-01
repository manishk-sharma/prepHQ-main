import React from 'react';
import './DashboardOverview.css';

const DashboardOverview = ({ allData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRecentData = (data, count = 5) => {
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.created_date || a.created_at || a.subscribed_at || a.subscription_date || 0);
      const dateB = new Date(b.created_date || b.created_at || b.subscribed_at || b.subscription_date || 0);
      return dateB - dateA;
    });
    return sortedData.slice(0, count);
  };

  const users = allData.user || [];
  const contacts = allData.contact_messages || [];
  const subscribers = allData.newsletter_subscribers || [];
  const accounts = allData.accountconfirm || [];

  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <div className="stat-number">{users.length}</div>
            <div className="stat-bar">
              <div className="stat-progress" style={{width: `${Math.min((users.length / 100) * 100, 100)}%`}}></div>
            </div>
          </div>
        </div>
        <div className="stat-card subscribers">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>Total Subscribers</h3>
            <div className="stat-number">{subscribers.length}</div>
            <div className="stat-bar">
              <div className="stat-progress" style={{width: `${Math.min((subscribers.length / 50) * 100, 100)}%`}}></div>
            </div>
          </div>
        </div>
        <div className="stat-card contacts">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>Contact Messages</h3>
            <div className="stat-number">{contacts.length}</div>
            <div className="stat-bar">
              <div className="stat-progress" style={{width: `${Math.min((contacts.length / 30) * 100, 100)}%`}}></div>
            </div>
          </div>
        </div>
        <div className="stat-card accounts">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Account Confirmations</h3>
            <div className="stat-number">{accounts.length}</div>
            <div className="stat-bar">
              <div className="stat-progress" style={{width: `${Math.min((accounts.length / 20) * 100, 100)}%`}}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-data-section">
        <div className="recent-section">
          <h3>Recent Activity</h3>
          <div className="recent-tabs">
            <div className="recent-tab">
              <h4>Recent Users</h4>
              <div className="recent-list">
                {getRecentData(users).map((user, index) => (
                  <div key={index} className="recent-item">
                    <span>{user.name || user.username || 'N/A'}</span>
                    <div className="date-info">
                      <span className="calendar-icon">📅</span>
                      <small>{formatDate(user.created_date)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="recent-tab">
              <h4>Recent Subscribers</h4>
              <div className="recent-list">
                {getRecentData(subscribers).map((subscriber, index) => (
                  <div key={index} className="recent-item">
                    <span>{subscriber.email || 'N/A'}</span>
                    <div className="date-info">
                      <span className="calendar-icon">📅</span>
                      <small>{formatDate(subscriber.subscribed_at || subscriber.created_at || subscriber.subscription_date)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="recent-tab">
              <h4>Recent Contacts</h4>
              <div className="recent-list">
                {getRecentData(contacts).map((contact, index) => (
                  <div key={index} className="recent-item">
                    <span>{contact.name || contact.email || 'N/A'}</span>
                    <div className="date-info">
                      <span className="calendar-icon">📅</span>
                      <small>{formatDate(contact.created_at)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="recent-tab">
              <h4>Recent Account Confirmations</h4>
              <div className="recent-list">
                {getRecentData(accounts).map((account, index) => (
                  <div key={index} className="recent-item">
                    <span>{account.email || 'N/A'}</span>
                    <div className="date-info">
                      <span className="calendar-icon">📅</span>
                      <small>{formatDate(account.created_at)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;