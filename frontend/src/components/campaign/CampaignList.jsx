import React, { useState } from 'react';

const CampaignList = ({ campaigns }) => {

  if (!Array.isArray(campaigns)) {
    return <p>Loading campaigns...</p>;
  }

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
              </div>
            </div>
          ))}
        </div> 
      </div>
    </div>
  )
}

export default CampaignList
