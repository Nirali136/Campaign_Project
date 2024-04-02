import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const URL_SERV = 'http://localhost:3000';

const CreateCampaign = ({ campaigns ,formData, onChange, onSubmit, editing, onUpdate}) => {

  const { id } = useParams();
 const [initialFormData, setInitialFormData] = useState({...formData});
 const [imageFile, setImageFile] = useState([]);
 const [errors, setErrors] = useState({});
 const [userIds, setUserIds] = useState([]);
 const [selectedUserIds, setSelectedUserIds] = useState([]);
 const navigate = useNavigate();
 const location = useLocation();

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

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await fetch(`${URL_SERV}/users`);
        if (response.ok) {
          const data = await response.json();
          setUserIds(data.userIds);
        } else {
          throw new Error('Failed to fetch user IDs');
        }
      } catch (error) {
        console.error('Error fetching user IDs:', error);
      }
    };
    fetchUserIds();
    
  }, []);

  const handleImageUpload = async (e) => {
     const files = Array.from(e.target.files);
     if(files.length > 5){
      e.preventDefault();
      alert(`Cannot upload files more than 5`);
      return;
     }
     setImageFile(files);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(editing && name === "type" && value === "public"){
      setInitialFormData({ ...initialFormData, [name]: value});
    }else{
      setInitialFormData({...initialFormData, [name]:value});
      //onChange(e);
    }
    // Validate the changed field
    validateField(name, value);
  };

  const handleSelectChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map(option => option.value);
    setSelectedUserIds(selectedIds); 
    setInitialFormData({ ...initialFormData, assignedUsers: selectedIds });
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'title':
        if (value.trim().length < 3) {
          errorMessage = 'Title must be at least 3 characters long';
        }
        break;
      case "imageUrl":
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const fileSizeLimit = 5 * 1024 * 1024; // 5 MB limit
        if (!value) {
          errorMessage = "Please select an image";
        } else {
          const fileExtension = value && value.name ? value.name.split(".").pop().toLowerCase() : '';
          if (!allowedExtensions.includes(fileExtension)) {
            errorMessage = "Only JPG, JPEG or PNG files are allowed";
          } else if (value.size > fileSizeLimit) {
            errorMessage = "File size exceeds 5MB limit";
          }
        }
      break;
      case 'description':
        if (value.trim().length < 8) {
          errorMessage = 'Description must be at least 8 characters long';
        } else if (value.trim().length > 200) {
          errorMessage = 'Description must be at most 200 characters long';
        }
        break;
      default:
        break;
    }
    setErrors({
      ...errors,
      [name]: errorMessage
    });
  };


  const handleSubmit =async (e) => {
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

    if (imageFile && errors["imageUrl"]) {
      console.log('imagefile',imageFile);
      formIsValid = false;
    }

    if (imageFile.length === 0) {
      setErrors({ ...errors, imageUrl: "Please select at least one image" });
      formIsValid = false;
    }
  
    if(formIsValid){
      const formDataWithImage = new FormData();
      const { imageUrl, ...formDataWithoutImage } = initialFormData;
      for (const key in formDataWithoutImage) {
        formDataWithImage.append(key, initialFormData[key]);
      }
      imageFile.forEach((file)=> {
        formDataWithImage.append( "imageUrl" , file );
      })
      // formDataWithImage.append("imageUrl", imageFile);
    if (editing) {
      await onUpdate(formDataWithImage,initialFormData._id); 
    } else {
      await onSubmit(e, formDataWithImage);
    }
    navigate('/campaigns', { replace: true });
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
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title && 'is-invalid'}`}
                    id="title"
                    name="title"
                    value={initialFormData.title}
                    onChange={handleChange}
                    maxLength={30}
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
                  <label htmlFor="image">Image</label><br/>
                  <input
                    type="file"
                    className={`form-control ${errors.imageUrl && "is-invalid"}`}
                    id="imageUrl"
                    name="imageUrl"
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple
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
                    maxLength={200}
                    rows="3"
                    required
                  ></textarea>
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
                {initialFormData.type === "private" && (
                  <div className="form-group">
                    <label htmlFor="assignedUsers">Assigned User</label>
                    <Select
                      className={`form-control ${errors.assignedUsers && 'is-invalid'}`}
                      id="assignedUsers"
                      name="assignedUsers"
                      value={selectedUserIds.map(id => ({ value: id , label: id }))}
                      onChange={handleSelectChange}
                      options={userIds.map(userId => ({ value: userId, label: userId }))}
                      isMulti
                      required
                    />             
                    {errors.assignedUsers && <div className="invalid-feedback">{errors.assignedUsers}</div>}
                  </div>
                )}
                <button type="submit" className="btn btn-orange mt-2">
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
