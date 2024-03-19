import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const UpdateCampaign = ({ campaigns, onEdit, onAddUser, onDelete, onRemoveUser }) => {

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
        {campaigns.map(campaign => (
            <div
              key={campaign._id}
              className="card mt-3"
            >
              <div className="card-header">{campaign.title}</div>
              <div className="card-body">
                <p className="card-text"><strong>Type:</strong> {campaign.type}</p>
                <p className="card-text"><strong>Image URL:</strong> {campaign.imageUrl}</p>
                <p className="card-text"><strong>Description:</strong> {campaign.description}</p>
                <Link to={`/campaign/${campaign._id}`} className="btn btn-primary mr-2" onClick={()=>onEdit(campaign._id)}>Edit</Link>
                <button className="btn btn-danger" onClick={() => onDelete(campaign._id)}>Delete</button>
                {campaign.type === 'private' && (
                <>
                  <Link to={`/campaign/${campaign._id}/assignUser`} className="btn btn-success mr-2">Add User</Link>
                  <Link to={`/campaign/${campaign._id}/removeUser`}className="btn btn-warning mr-2">Remove User</Link>
                </>
                )}
                {/* </>
                )} */}
              </div>
            </div>
          ))}
        </div> 
      </div>
    </div>
  )
}

export default UpdateCampaign
