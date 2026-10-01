import React, { useState } from 'react';

const ContactTable = ({ data, onView, onSelect, selectedItems, onSelectAll, isAllSelected }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const contactsArray = Array.isArray(data) ? data : [];
  const indexOfLastContact = currentPage * usersPerPage;
  const indexOfFirstContact = indexOfLastContact - usersPerPage;
  const currentContacts = contactsArray.slice(indexOfFirstContact, indexOfLastContact);
  const totalPages = Math.ceil(contactsArray.length / usersPerPage);

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
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentContacts.length > 0 ? currentContacts.map((contact, index) => (
            <tr key={contact.id || index}>
              <td>
                <input 
                  type="checkbox" 
                  onChange={(e) => onSelect(contact, e.target.checked)}
                  checked={selectedItems.some(item => JSON.stringify(item) === JSON.stringify(contact))}
                />
              </td>
              <td>{indexOfFirstContact + index + 1}</td>
              <td>{contact.name || 'N/A'}</td>
              <td>{contact.email || 'N/A'}</td>
              <td>{contact.subject || 'N/A'}</td>
              <td>{contact.message ? contact.message.substring(0, 50) + '...' : 'N/A'}</td>
              <td>{contact.created_at || 'N/A'}</td>
              <td>
                <button onClick={() => onView(contact)} className="view-btn">View</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="8">No contact messages found</td></tr>
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

export default ContactTable;