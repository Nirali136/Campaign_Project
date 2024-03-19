import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const URL_SERV = 'http://localhost:3000';

const RemoveUserFromCampaign = ({campaigns, setCampaigns}) => {
  const [userId, setUserId] = useState('');
  const { campaignId } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL_SERV}/admin/campaign/${campaignId}/removeUser/${userId}`, {
        method: 'DELETE'
      })
        console.log('User removed successfully');
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-3">
            <div className="card-header">Remove User from Campaign</div>
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
                <button type="submit" className="btn btn-warning">Remove User</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveUserFromCampaign;
