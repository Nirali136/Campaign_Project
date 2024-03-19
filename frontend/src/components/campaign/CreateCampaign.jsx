import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CreateCampaign = ({ campaigns ,formData, onChange, onSubmit, editing, onUpdate}) => {

  const { id } = useParams();
 const [initialFormData, setInitialFormData] = useState({...formData});
 const [errors, setErrors] = useState({});
 const navigate = useNavigate();

 // const campaign = campaigns.find(campaign => campaign._id === id);

  //const initialFormData = editing && campaign ? campaign : formData;
  useEffect(() => {
    if (editing && campaigns.length > 0) {
      const campaign = campaigns.find(campaign => campaign._id === id);
      if (campaign) {
        setInitialFormData({ ...campaign });
      }
    } else {
      setInitialFormData({ ...formData });
    }
  }, [campaigns, formData, editing, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(editing){
        setInitialFormData({
          ...initialFormData,
          [name]: value
      });
    }else{
        onChange(e);
    }
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'title':
        if (value.trim().length < 3) {
          errorMessage = 'Title must be at least 3 characters long';
        }
        break;
      case  'imageUrl':
        if (!/^https?:\/\//i.test(value)) {
          errorMessage = "Image URL must start with 'http://' or 'https://'"; 
        }
        break;
      case 'description':
        if (value.trim().length < 8) {
          errorMessage = 'Description must be at least 8 characters long';
        } else if (value.trim().length > 200) {
          errorMessage = 'Description must be at most 200 characters long';
        }
        break;
      case 'assignedUsers':
        const userIdRegex = /^[a-z0-9]{24}$/;
        if (!userIdRegex.test(value)) {
          errorMessage = 'Assigned user ID must be 24 characters long and contain only lowercase letters (a-z) and digits (0-9)';
        }
        break;
      default:
        errorMessage = 'filed is required'
        break;
    }
    setErrors({
      ...errors,
      [name]: errorMessage
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    let formIsValid = true;
    for (const key in initialFormData) {
      if (initialFormData.hasOwnProperty(key)) {
        validateField(key, initialFormData[key]);
        if (errors[key]) {
          formIsValid = false;
        }
      }
    }
    if(formIsValid){
    if (editing) {
      onUpdate(initialFormData,initialFormData._id);
      navigate(`/updatecampaign`,{replace: true} );
    } else {
      onSubmit(e);
      navigate(`/campaigns`, {replace: true });
    }
  }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-white">
            {editing ? 'Edit Campaign' : 'Create Campaign'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title && 'is-invalid'}`}
                    id="title"
                    name="title"
                    value={initialFormData.title}
                    onChange={handleChange}
                    required
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    className="form-control custom-select"
                    id="type"
                    name="type"
                    value={initialFormData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="text"
                    className={`form-control ${errors.imageUrl && 'is-invalid'}`}
                    id="imageUrl"
                    name="imageUrl"
                    value={initialFormData.imageUrl}
                    onChange={handleChange}
                    required
                  />
                   {errors.imageUrl && <div className="invalid-feedback">{errors.imageUrl}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className={`form-control ${errors.description && 'is-invalid'}`}
                    id="description"
                    name="description"
                    value={initialFormData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
                {initialFormData.type === "private" && (
                  <div className="form-group">
                    <label htmlFor="assignedUsers">Assigned User</label>
                    <input
                      type="text"
                      className={`form-control ${errors.assignedUsers && 'is-invalid'}`}
                      id="assignedUsers"
                      name="assignedUsers"
                      value={initialFormData.assignedUsers}
                      onChange={handleChange}
                      required
                    />
                    {errors.assignedUsers && <div className="invalid-feedback">{errors.assignedUsers}</div>}
                  </div>
                )}
                <button type="submit" className="btn btn-primary">
                {editing ? 'Save Changes' : 'Create'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
