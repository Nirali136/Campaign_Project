import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
const URL_SERV = 'http://localhost:3000';

const AddUserToCampaign = () => {
    
      const [userId, setUserId] = useState('');
      const {campaignId} = useParams();
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${URL_SERV}/admin/campaign/${campaignId}/assignUser/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ userId: userId }),
          });
          // if (!response.ok) { throw new Error('Server response not ok'); }
          //   const data = await response.json();
            console.log('User added successfully');
        } catch (error) {
          console.error('failed to add user:', error);
        }
      };
    
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mt-3">
                <div className="card-header">Add User to Campaign</div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="userId">User ID:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Add User</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

export default AddUserToCampaign
