import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, incrementPage, setSort, setFilter, applyFilters } from '../store';
import './UserList.css';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, page, loading, hasMore, sort, filter } = useSelector((state) => state.user);

  const genderOptions = ['male', 'female'];
  const countryOptions = ['Columbus', 'Chicago', 'New York', 'San Francisco'];

  // Fetch users on initial render and when sort changes
  useEffect(() => {
    dispatch(fetchUsers({ page, pageSize: 30, sortKey: sort.key, sortDirection: sort.direction }));
  }, [dispatch, page, sort]);

  // Apply filters whenever they change
  useEffect(() => {
    dispatch(applyFilters());
  }, [filter, dispatch]);

  // Infinite scroll functionality
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 1 && !loading && hasMore) {
      dispatch(incrementPage());
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Handle sorting
  const handleSort = (key) => {
    const newDirection = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    dispatch(setSort({ key, direction: newDirection }));
    dispatch(fetchUsers({ page: 1, pageSize: 30, sortKey: key, sortDirection: newDirection }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilter({ ...filter, [name]: value }));
    dispatch(applyFilters());
  };

  return (
    <div className="user-list-container">
      <h1>User Listing</h1>
      <div className="filters">
        <label>
          Gender:
          <select name="gender" value={filter.gender} onChange={handleFilterChange}>
            <option value="">Any</option>
            {genderOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Country:
          <select name="country" value={filter.country} onChange={handleFilterChange}>
            <option value="">Any</option>
            {countryOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID {sort.key === 'id' && (sort.direction === 'asc' ? '↑' : '↓')}</th>
            <th>Image</th>
            <th onClick={() => handleSort('name')}>Full Name {sort.key === 'name' && (sort.direction === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('age')}>Age {sort.key === 'age' && (sort.direction === 'asc' ? '↑' : '↓')}</th>
            <th>Designation</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><img src={user.image} alt={user.firstName} width="50" height="50" /></td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.age}</td>
              <td>{user.company.title}</td>
              <td>{user.address.city}, {user.address.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p className="loading">Loading...</p>}
    </div>
  );
};

export default UserList;
