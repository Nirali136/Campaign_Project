import React, { useEffect, useState } from 'react';
import CampaignDetails from './CampaignDetails';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const CampaignList = ({ campaigns }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();

  if (!Array.isArray(campaigns)) {
    return <p>Loading campaigns...</p>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = campaigns.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const maxLength = 10;

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      navigate(`/campaigns?page=${pageNumber}`);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      navigate(`/campaigns?page=${currentPage - 1}`);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      navigate(`/campaigns?page=${currentPage + 1}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
        {currentItems.map(campaign => (
            <div
              key={campaign._id}
              className="card mt-3"
            >
              <div className="card-header"><strong>{campaign.title}</strong></div>
              <div className="row no-gutters">
                <div className="col-md-4">
                  <img src={`http://localhost:3000/${campaign.imageUrl[0]}`} className='image-fluid w-100 h-100 rounded' alt={campaign.title} />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <p className="card-text"><strong>Type:</strong> {campaign.type}</p>
                    <p className="card-text"><strong>Description:</strong> {campaign.description.length > maxLength ? campaign.description.substring(0, maxLength) + '...' : campaign.description}</p>
                    <div className="text-right"> 
                      <Link to={`/campaigndetails/${campaign._id}`} className="btn btn-orange">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> 
        <div className="pagination fixed-bottom">
            {currentPage !== 1 && (
              <Link to={`/campaigns?page=${currentPage - 1}`} className="pagination-btn" onClick={()=>goToPreviousPage()}>Previous</Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => (
            <Link key={i} to={`/campaigns?page=${i + 1}`} className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => goToPage(i + 1)}>
              {i + 1}
            </Link>
            ))}
           {currentPage !== totalPages && (
            <Link to={`/campaigns?page=${currentPage + 1}`} className="pagination-btn" onClick={()=>goToNextPage()}>Next</Link>
          )}
          </div>
      </div>
    </div>
  )
}

export default CampaignList
