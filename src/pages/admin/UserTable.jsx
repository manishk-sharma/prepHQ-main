import React, { useState } from 'react';

const UserTable = ({ data, onView, onSelect, selectedItems, onSelectAll, isAllSelected }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const usersArray = Array.isArray(data) ? data : [];
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersArray.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(usersArray.length / usersPerPage);

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
            <th>Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>User Type</th>
            <th>Phone</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? currentUsers.map((user, index) => (
            <tr key={user.id || index}>
              <td>
                <input 
                  type="checkbox" 
                  onChange={(e) => onSelect(user, e.target.checked)}
                  checked={selectedItems.some(item => JSON.stringify(item) === JSON.stringify(user))}
                />
              </td>
              <td>{indexOfFirstUser + index + 1}</td>
              <td>{user.name || 'N/A'}</td>
              <td>{user.lastname || 'N/A'}</td>
              <td>{user.username || 'N/A'}</td>
              <td>{user.email || 'N/A'}</td>
              <td>{user.status || 'N/A'}</td>
              <td>{user.created_date || 'N/A'}</td>
              <td>{user.usertype || 'N/A'}</td>
              <td>{user.phone || 'N/A'}</td>
              <td>{user.city || 'N/A'}</td>
              <td>
                <button onClick={() => onView(user)} className="view-btn">View</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="12">No users found</td></tr>
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

export default UserTable;