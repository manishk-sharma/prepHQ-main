import React, { useState } from 'react';

const AccountConfirmTable = ({ data, onView, onSelect, selectedItems, onSelectAll, isAllSelected }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const accountsArray = Array.isArray(data) ? data : [];
  const indexOfLastAccount = currentPage * usersPerPage;
  const indexOfFirstAccount = indexOfLastAccount - usersPerPage;
  const currentAccounts = accountsArray.slice(indexOfFirstAccount, indexOfLastAccount);
  const totalPages = Math.ceil(accountsArray.length / usersPerPage);

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
            <th>User ID</th>
            <th>Email</th>
            <th>Token</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAccounts.length > 0 ? currentAccounts.map((account, index) => (
            <tr key={account.id || index}>
              <td>
                <input 
                  type="checkbox" 
                  onChange={(e) => onSelect(account, e.target.checked)}
                  checked={selectedItems.some(item => JSON.stringify(item) === JSON.stringify(account))}
                />
              </td>
              <td>{indexOfFirstAccount + index + 1}</td>
              <td>{account.user_id || 'N/A'}</td>
              <td>{account.email || 'N/A'}</td>
              <td>{account.token ? account.token.substring(0, 20) + '...' : 'N/A'}</td>
              <td>{account.status || 'N/A'}</td>
              <td>{account.created_at || 'N/A'}</td>
              <td>
                <button onClick={() => onView(account)} className="view-btn">View</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="8">No account confirmations found</td></tr>
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

export default AccountConfirmTable;