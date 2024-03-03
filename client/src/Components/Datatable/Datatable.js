import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Datatable.css';

const Datatable = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState({ date: 'asc', time: 'asc' }); // Default sort order is ascending for both date and time
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/zithara');
        setCustomers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setError('Error fetching data. Please try again.');
      }
    };
    fetchCustomers();
  }, []);

  // Sort customers based on created_at date
  const sortedCustomers = [...customers].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    if (sortOrder.date === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  // Sort customers based on created_at time
  const sortedCustomersByTime = [...sortedCustomers].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    if (sortOrder.time === 'asc') {
      return timeA - timeB;
    } else {
      return timeB - timeA;
    }
  });

  // Filter and sort customers based on search term
  const filteredAndSortedCustomers = sortedCustomersByTime.filter(customer =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the index of the first and last item to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  // Change page
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  // Toggle sort order for date
  const toggleDateSortOrder = () => {
    setSortOrder({ ...sortOrder, date: sortOrder.date === 'asc' ? 'desc' : 'asc' });
  };

  // Toggle sort order for time
  const toggleTimeSortOrder = () => {
    setSortOrder({ ...sortOrder, time: sortOrder.time === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div>
      <h1>Zithara Task 2(Duguta Shynu Pavan)</h1>
      {error && <div className="error">{error}</div>}
      
      <center>
      <input type="text" className="search-input" value={searchTerm} onChange={handleSearchChange} placeholder="Search by name or location" />

      <button onClick={toggleDateSortOrder}>Sort by Date ({sortOrder.date === 'asc' ? 'Ascending' : 'Descending'})</button>
      <button onClick={toggleTimeSortOrder}>Sort by Time ({sortOrder.time === 'asc' ? 'Ascending' : 'Descending'})</button>
      </center>
   <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Created At (Date)</th>
            <th>Created At (Time)</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedCustomers.slice(indexOfFirstItem, indexOfLastItem).map((customer, index) => (
            <tr key={customer.sno}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={nextPage} disabled={indexOfLastItem >= filteredAndSortedCustomers.length}>Next</button>
      </div>
    </div>
  );
};

export default Datatable;