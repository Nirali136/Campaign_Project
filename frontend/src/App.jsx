import React, { useEffect, useState } from  'react';
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import CreateCampaign from './components/campaign/CreateCampaign';
import CampaignList from './components/campaign/CampaignList';
import Header from './components/common/Header';
import UpdateCampaign from './components/campaign/UpdateCampaign';
import { useParams } from "react-router-dom";
import { AuthProvider } from './components/context/AuthContext';
import AddUserToCampaign from './components/campaign/AddUserToCampaign';
import RemoveUserFromCampaign from './components/campaign/RemoveUserFromCampaign';

const URL_SERV = 'http://localhost:3000';

const App =()=> {

  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    type: "public",
    imageUrl: "",
    description: "",
    assignedUsers: "",
  });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState("");
  
  const { id } = useParams();
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${URL_SERV}/admin/campaigns`, {
        });
        const data = await response.json();
        setCampaigns(data);
        console.log('Campaigns:', data);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      }
    };

    fetchCampaigns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch(`${URL_SERV}/admin/campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
        const data = await response.json();
        console.log('Campaign created successfully:', data);
        setCampaigns([...campaigns, data]);
    } catch (err) {
      console.error('Error creating Campaign :', err);
    }
  };

  const handleEdit = (campaignId) => {
    setEditing(true);
    setEditId(campaignId);
  }

  const handleUpdate = async (intialformdata,editId) => {
    try{
    const response = await fetch(`${URL_SERV}/admin/campaign/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(intialformdata),
    });
    const updatedCampaign = await response.json();
    const updatedCampaigns = campaigns.map(campaign =>
      campaign._id === id ? updatedCampaign : campaign
    );
    setCampaigns(updatedCampaigns);
    // navigate(`/updatecampaign`);
    //setEditing(false);
    //setEditId(null);
    console.log('Campaign updated successfully:', updatedCampaigns);
  } catch (err) {
    console.error('Error updating campaign:', err);
  }
  };


  const handleAddUser = async (campaign) => {

  }

  const handleDelete = async (campaignId) => {
    try {
      await fetch(`${URL_SERV}/admin/campaign/${campaignId}`, {
        method: 'DELETE',
      });
      setCampaigns(campaigns.filter(campaign => campaign._id !== campaignId));
      console.log('Campaign deleted successfully');
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  }
  const handleRemoveUser = (campaign) => {

  };

  return (
    <AuthProvider>
    <BrowserRouter>
      <div>
        <Header/>
        <Routes>
          <Route path="/" element={<CampaignList campaigns={campaigns}/>}/>
          <Route path="campaigns" element={<CampaignList campaigns={campaigns}/>}/>
          <Route path="createcampaign" element={<CreateCampaign campaigns={campaigns} formData={formData} editing={editing} onChange={handleChange} onSubmit={handleSubmit}/>} onEdit={handleEdit} onUpdate={handleUpdate} />
          <Route path="updatecampaign" element={<UpdateCampaign campaigns={campaigns} editing={editing} onEdit={handleEdit} onAddUser={handleAddUser} onDelete={handleDelete} onRemoveUser={handleRemoveUser}/>}/>
          <Route path="campaign/:id" element={<CreateCampaign campaigns={campaigns} formData={formData} editing={editing} onChange={handleChange} onSubmit={handleSubmit} onEdit={handleEdit} onUpdate={handleUpdate}/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="signup" element={<SignUp/>}/>
          <Route path="logout" element={<Header/>}/>  
          <Route path="campaign/:campaignId/assignUser" element={<AddUserToCampaign/>}/>      
          <Route path="campaign/:campaignId/removeUser" element={<RemoveUserFromCampaign campaigns={campaigns} setCampaigns={setCampaigns}/>}/>      
        </Routes>
      </div>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
