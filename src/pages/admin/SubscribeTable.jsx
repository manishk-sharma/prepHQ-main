import React, { useState } from 'react';

const SubscribeTable = ({ data, onView, onSelect, selectedItems, onSelectAll, isAllSelected }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const subscribersArray = Array.isArray(data) ? data : [];
  const indexOfLastSubscriber = currentPage * usersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - usersPerPage;
  const currentSubscribers = subscribersArray.slice(indexOfFirstSubscriber, indexOfLastSubscriber);
  const totalPages = Math.ceil(subscribersArray.length / usersPerPage);

  return (
    <>
      <table className="users-table">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                onChange={(e) => onSelectAll(e.target.checked)}
                checked={isAllSelected}
              />
            </th>
            <th>S.No</th>
            <th>Email</th>
            <th>Subscribed Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSubscribers.length > 0 ? currentSubscribers.map((subscriber, index) => (
            <tr key={subscriber.id || index}>
              <td>
                <input 
                  type="checkbox" 
                  onChange={(e) => onSelect(subscriber, e.target.checked)}
                  checked={selectedItems.some(item => JSON.stringify(item) === JSON.stringify(subscriber))}
                />
              </td>
              <td>{indexOfFirstSubscriber + index + 1}</td>
              <td>{subscriber.email || 'N/A'}</td>
              <td>{subscriber.subscribed_at || 'N/A'}</td>
              <td>{subscriber.status || 'Active'}</td>
              <td>
                <button onClick={() => onView(subscriber)} className="view-btn">View</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6">No subscribers found</td></tr>
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default SubscribeTable;