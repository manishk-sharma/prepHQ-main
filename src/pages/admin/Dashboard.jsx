import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
import DashboardOverview from './DashboardOverview';
import UserTable from './UserTable';
import ContactTable from './ContactTable';
import SubscribeTable from './SubscribeTable';
import AccountConfirmTable from './AccountConfirmTable';
import './Dashboard.css';

import logo from "../../assets/img/logo.svg";

import HeaderBannerHeading from "../../components/HeaderBannerHeading";
import JobsInterface from './JobsInterface';
import { useAllData } from '../../services/dashboardServices';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const { data: allData = {}, isLoading: loading, isError } = useAllData();

  useEffect(() => {
    if (isError) toast.error('Server Error Data Not fetch');
  }, [isError]);

  useEffect(() => {
    setSelectedItems([]);
  }, [activeTab]);

  const downloadCurrentData = () => {
    const currentData = allData[activeTab] || [];
    const csvContent = convertToCSV(currentData, `${getTabDisplayName()} Data`);
    downloadCSV(csvContent, `${activeTab}_data.csv`);
  };

  const downloadSelectedData = () => {
    const csvContent = convertToCSV(selectedItems, `Selected ${getTabDisplayName()} Data`);
    downloadCSV(csvContent, `selected_${activeTab}_data.csv`);
  };

  const handleItemSelect = (item, isSelected) => {
    console.log('Selecting item:', item, 'isSelected:', isSelected);
    if (isSelected) {
      setSelectedItems(prev => {
        const newItems = [...prev, item];
        console.log('New selected items count:', newItems.length);
        return newItems;
      });
    } else {
      setSelectedItems(prev => {
        const newItems = prev.filter(i => JSON.stringify(i) !== JSON.stringify(item));
        console.log('New selected items count after removal:', newItems.length);
        return newItems;
      });
    }
  };

  const handleSelectAll = (isSelected) => {
    const currentData = allData[activeTab] || [];
    if (isSelected) {
      setSelectedItems(currentData);
    } else {
      setSelectedItems([]);
    }
  };

  const isAllSelected = () => {
    const currentData = allData[activeTab] || [];
    return currentData.length > 0 && selectedItems.length === currentData.length;
  };

  const getTabDisplayName = () => {
    switch(activeTab) {
      case 'user': return 'User';
      case 'contact_messages': return 'Contact';
      case 'newsletter_subscribers': return 'Subscribe';
      case 'accountconfirm': return 'Account Confirm';
      default: return 'Data';
    }
  };

  const viewItem = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const sortDataDescending = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.created_date || a.created_at || a.subscribed_at || 0);
      const dateB = new Date(b.created_date || b.created_at || b.subscribed_at || 0);
      return dateB - dateA;
    });
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return <DashboardOverview allData={allData} />;
    }
    
    const currentData = sortDataDescending(allData[activeTab] || []);
    switch(activeTab) {
      case 'user':
        return <UserTable data={currentData} onView={viewItem} onSelect={handleItemSelect} selectedItems={selectedItems} onSelectAll={handleSelectAll} isAllSelected={isAllSelected()} />;
      case 'contact_messages':
        return <ContactTable data={currentData} onView={viewItem} onSelect={handleItemSelect} selectedItems={selectedItems} onSelectAll={handleSelectAll} isAllSelected={isAllSelected()} />;
      case 'newsletter_subscribers':
        return <SubscribeTable data={currentData} onView={viewItem} onSelect={handleItemSelect} selectedItems={selectedItems} onSelectAll={handleSelectAll} isAllSelected={isAllSelected()} />;
      case 'accountconfirm':
        return <AccountConfirmTable data={currentData} onView={viewItem} onSelect={handleItemSelect} selectedItems={selectedItems} onSelectAll={handleSelectAll} isAllSelected={isAllSelected()} />;
      case 'jobs':
        return <JobsInterface/>;
      default:
        return <div>No data available</div>;
    }
  };

  const convertToCSV = (data, tableName = 'Data') => {
    if (!Array.isArray(data) || data.length === 0) return '';
    const headers = Object.keys(data[0] || {});
    const csvRows = [tableName, '', headers.join(',')];
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    });
    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="loading">Loading...</div>;

  const currentYear = new Date().getFullYear();

  return (
    
    <section className='admin-page'>
      <header>
        <div className='container'>
          <nav className="navbar">
            <NavLink className="logo" to="/" onClick={scrollToTop}>
              <img
                src={logo}
                alt="Navbar"
                className="logo-img"
                width="140"
                height="47"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.textContent = "Logo";
                }}
              />
            </NavLink>
            
            <ul className="admin-nav-links">
            <li>
            <button onClick={onLogout} className="login-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3.63255 13.1673C3.91304 12.7266 4.11715 12.366 4.36071 12.0329C4.84907 11.365 5.46578 10.8441 6.22837 10.5073C6.71234 10.2932 7.19069 10.4291 7.39229 10.8366C7.60517 11.2667 7.43236 11.7393 6.93649 11.9716C6.1307 12.3491 5.57409 12.9538 5.23287 13.7626C5.05756 14.1783 5.07822 14.2171 5.48393 14.3993C6.36736 14.7968 7.28398 15.0466 8.26195 15.0454C8.69834 15.0454 9.01202 15.2789 9.11908 15.6457C9.21926 15.9869 9.08277 16.3644 8.74405 16.5578C8.60067 16.6399 8.40783 16.6668 8.23815 16.6655C6.50949 16.6505 4.93171 16.1434 3.52674 15.1405C1.70478 13.8397 0.567781 12.0724 0.149545 9.88004C-0.509114 6.42814 1.05301 3.07139 3.94811 1.27219C5.66425 0.206072 7.53817 -0.226512 9.54546 0.114046C12.9846 0.698128 15.2248 2.70454 16.2936 5.99618C16.5277 6.71673 16.5622 7.50803 16.6411 8.27115C16.6937 8.77949 16.3224 9.16136 15.8559 9.17138C15.4114 9.18077 15.0533 8.8208 15.0326 8.32124C14.9875 7.25637 14.7728 6.23595 14.2713 5.28564C13.262 3.37188 11.6767 2.1624 9.57739 1.77802C5.90405 1.10504 2.6383 3.41257 1.83501 6.76682C1.31284 8.94851 1.83063 10.9142 3.21369 12.664C3.3364 12.8192 3.46663 12.9688 3.6313 13.1667L3.63255 13.1673Z" fill="black"/>
                <path d="M11.0281 9.19767C11.3261 9.29533 11.8414 9.44996 12.3473 9.63213C14.3858 10.3646 16.4207 11.1077 18.458 11.8433C19.2325 12.1225 19.3953 12.7754 18.8212 13.3657C18.1888 14.0162 17.5508 14.6616 16.9047 15.2989C16.7287 15.4723 16.7319 15.5869 16.9072 15.7597C17.8507 16.6893 18.7886 17.6259 19.7202 18.568C20.1547 19.0075 20.0702 19.636 19.5562 19.9133C19.2607 20.0724 18.8819 20.0135 18.582 19.7287C18.1738 19.3412 17.7806 18.9374 17.3817 18.5398C16.8427 18.0021 16.2973 17.4706 15.7702 16.9209C15.5861 16.7294 15.464 16.7363 15.2843 16.9197C14.6638 17.5526 14.0371 18.1799 13.3985 18.7946C13.247 18.9405 13.0529 19.0832 12.855 19.1302C12.4155 19.2354 12.0881 19.0463 11.9184 18.5999C11.5628 17.6653 11.2297 16.7219 10.8897 15.7816C10.3512 14.2929 9.80591 12.8067 9.28061 11.3136C8.92186 10.2951 9.712 9.20518 11.0287 9.19767H11.0281ZM10.9511 10.8879C10.9266 10.913 10.9022 10.938 10.8772 10.9631C11.5834 12.9044 12.2903 14.8457 13.0091 16.8214C13.113 16.7475 13.1487 16.7288 13.1762 16.7012C14.3333 15.5443 15.4884 14.3862 16.6473 13.2305C16.8333 13.0446 16.7619 12.9645 16.549 12.8887C15.1084 12.376 13.6702 11.8558 12.2308 11.3393C11.8051 11.1866 11.3774 11.0382 10.9511 10.8879Z" fill="black"/>
                <path d="M5.44637 6.22405C5.43948 4.67151 6.72862 3.40318 8.29075 3.37C9.89231 3.3362 11.2647 4.63958 11.2366 6.32735C11.2096 7.95 9.99312 9.13069 8.40783 9.17451C6.70733 9.22146 5.45388 7.93999 5.44637 6.22405ZM9.5874 6.28165C9.5874 5.5636 9.03894 4.98765 8.35085 4.98264C7.6659 4.97764 7.06609 5.5661 7.06359 6.24534C7.06108 6.96088 7.60955 7.51993 8.31642 7.52243C9.05835 7.52431 9.58803 7.00784 9.5874 6.28227V6.28165Z" fill="black"/>
              </svg> 
              <span>Log Out</span></button>
            </li>
          </ul>
          </nav>
        </div>
      </header>
      <div style={{margin: "2rem 0"}}>
        <HeaderBannerHeading title="Admin" highlight="DashBoard" />
        <div className='container' style={{textAlign: "right", marginTop: "15px"}}>
          {activeTab !== 'overview' && activeTab !== 'jobs' && (
            <>
              <button onClick={downloadCurrentData} className="login-btn download-btn">Download All {getTabDisplayName()} Data</button>
              {selectedItems.length > 0 && (
                <button onClick={downloadSelectedData} className="login-btn download-btn">
                  Download Selected {getTabDisplayName()} Data ({selectedItems.length})
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="dashboard-content container">
        <div className="sidebar">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Dashboard
            </button>
            <button 
              className={`tab ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              Users
            </button>
             <button 
              className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              Jobs
            </button>
            <button 
              className={`tab ${activeTab === 'contact_messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact_messages')}
            >
              Contacts
            </button>
            <button 
              className={`tab ${activeTab === 'newsletter_subscribers' ? 'active' : ''}`}
              onClick={() => setActiveTab('newsletter_subscribers')}
            >
              Subscribers
            </button>
            <button 
              className={`tab ${activeTab === 'accountconfirm' ? 'active' : ''}`}
              onClick={() => setActiveTab('accountconfirm')}
            >
              Account Confirms
            </button>
          </div>
        </div>
        <div className="content-container">
          {renderContent()}
        </div>
      </div>
      {showPopup && selectedItem && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Details</h2>
              <button className="close-btn" onClick={closePopup}>×</button>
            </div>
            <div className="popup-body">
              <div className="user-info">
                {Object.entries(selectedItem).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value || 'N/A'}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className='adminfooter'>
        <div className='container'>
          <p style={{padding: "1rem 0", textAlign: "center", color: "#fff"}}>
              &copy; 2024 - {currentYear} PrepHQ - The IoT Academy. All Rights
                Reserved.
              </p>
        </div>
      </footer>
    </section>
  );
};

export default Dashboard;