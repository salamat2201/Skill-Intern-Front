import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../api/api";
import './AllUsers.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${api}/api/admin/allUsers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="all-users-container">
      <h1 className="header">All Users (Admin Only)</h1>
      {users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              <th className="table-header">Username</th>
              <th className="table-header">Email</th>
              <th className="table-header">Password</th>
              <th className="table-header">Is Employer</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="table-row">
                <td className="table-cell">{user.username}</td>
                <td className="table-cell">{user.email}</td>
                <td className="table-cell">{user.password}</td>
                <td className="table-cell">{user.isEmployer ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-users-message">No users found</p>
      )}
    </div>
  );
};

export default AllUsers;
