import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const URL_SERV = 'http://localhost:3000';

const DeleteUser = () => {
    const [userId, setUserId] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [errors, setErrors] = useState('');

  const userIdRegex = /^[a-z0-9]{24}$/;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${URL_SERV}/users`);
        if (response.ok) {
          const data = await response.json();
          setUserIds(data.userIds);
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    if (!userIdRegex.test(value)) {
      setErrors(
        'Assigned user ID must be 24 characters long and contain only lowercase letters (a-z) and digits (0-9)'
      );
    } else {
      setErrors('');
    }
    setUserId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL_SERV}/deleteUser/${userId}`, { 
        method: 'DELETE' 
    });
    if(response.ok){
        console.log('User removed successfully');
        toast.success('User removed successfully');
      }else{
        throw new Error('Server error!');
    }
    } catch (error) {
      console.error('Failed to remove user:', error);
      toast.error('Failed to remove user');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-3">
            <div className="card-header">Delete User From Database</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="userId">User ID:</label>
                  <select
                    className={`form-control ${errors && 'is-invalid'}`}
                    id="userId"
                    value={userId}
                    onChange={handleChange}
                    maxLength={24}
                    required
                  >
                    <option value="">Select User ID</option>
                    {userIds.map(id => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                  </select>
                  {errors && <div className="invalid-feedback">{errors}</div>}
                </div>
                <button type="submit" className="btn btn-danger mt-2">Delete User</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
