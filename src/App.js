import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editFormData, setEditFormData] = useState({ id: '', name: '', email: '', role: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page whenever a new search is initiated
  };

  const filterData = (data, searchQuery) => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredData = filterData(data, searchQuery);

  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const handleEditClick = (item) => {
    setEditMode(item.id);
    setEditFormData({ id: item.id, name: item.name, email: item.email, role: item.role });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSave = () => {
    const newData = data.map((item) =>
      item.id === editMode ? editFormData : item
    );
    setData(newData);
    setEditMode(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Welcome to Admin Panel</h1>

      <div className="Head-App-menu">
        <div className="search-txt">
          <input
            type="text"
            className="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by Name, Email or role"
          />
        </div>

        <div className="head-bar">
          <div>CheckBox</div>
          <div className="A-head">ID</div>
          <div className="B-head">Name</div>
          <div className="C-head">Email</div>
          <div className="D-head">Role</div>
          <div className="E-head">Delete</div>
          <div className="F-head">Edit</div>
        </div>

        {currentItems.map((item, index) => (
          <div key={index} className="App-menu">
            <div className="E">
              <input type="checkbox" id={item.id} name={item.id} value={item.id}></input>
            </div>
            <div className="A">{item.id}</div>
            {editMode === item.id ? (
              <>
                <div className="B">
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="C">
                  <input
                    type="text"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="D">
                  <input
                    type="text"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="F">
                  <button onClick={handleEditSave}>Save</button>
                </div>
              </>
            ) : (
              <>
                <div className="B">{item.name}</div>
                <div className="C">{item.email}</div>
                <div className="D">{item.role}</div>
                <div className="E">
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
                <div className="F">
                  <button onClick={() => handleEditClick(item)}>Edit</button>
                </div>
              </>
            )}
          </div>
        ))}

        <div className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
