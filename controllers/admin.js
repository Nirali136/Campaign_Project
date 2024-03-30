const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Campaign = require('../models/campaign');
const User = require('../models/user');

exports.getCampaigns = async  (req, res) => {
    try{
        const campaigns = await Campaign
        .find()
        // .populate('admin')
        .populate('assignedUsers');
        if(!campaigns){
            throw new Error("No campaigns found!");
        } 
        res.status(200).json(campaigns);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

exports.createCampaign  = async (req,res)=>{
    let { title, type, description, assignedUsers } = req.body;
    assignedUsers = assignedUsers.split(",").map(id=>id.trim());
    //console.log(assignedUsers);
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    if(!req.files){
        return  res.status(400).json({msg:"Please select an image!"});
    }
    console.log(req.files);
    try{
        if (type === 'private') {
            if (!assignedUsers || assignedUsers.length === 0) {
                return res.status(400).json({ message: 'Assigned users are required for private campaigns.' });
            }
        } else {
            assignedUsers = undefined; 
        }
        const imageUrl = req.files.map((file) => file.path.replace('\\', '/'));
        console.log(imageUrl);
        // const imageUrl = req.file.path.replace("\\","/"); 
        // console.log(imageUrl);
        const campaign = new Campaign({
            title,
            type,
            description,
            assignedUsers,
            imageUrl
        });
        const newCampaign = await campaign.save();
        res.status(201).json(newCampaign);
    }catch(err){
        console.log(err);
        return res.status(400).json({ message: err.message });
    }
}

exports.getCampaign = async (req,res) => {
    const campaignId = req.params.campaignId;
    try{
        const  campaign = await Campaign
        .findById(campaignId)
        // .populate('admin')
        .populate('assignedUsers');
        if (!campaign) {
          throw new Error('campaign is not in records.');
        }
        res.status(200).json(campaign);
    }catch(err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.updateCampaign = async (req,res) => {
    const campaignId = req.params.campaignId;
    let { type, assignedUsers} = req.body;
    const newImages = req.files;
    let imageUrl = newImages ? newImages.map((file) => file.path) : undefined;      
   //let imageUrl = req.file ? req.file.path : undefined;
    console.log(type);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try{
        let campaign = await Campaign.findById(campaignId);
        console.log(campaign);
        console.log(campaign.type);
        console.log(campaign.assignedUsers);
        if(!campaign){
            throw new Error("No campaigns found!");
        }
        if(type === 'public'){
            campaign.assignedUsers = undefined;
        }
        if(imageUrl){
        if(campaign.imageUrl !== imageUrl){
            // clearImage(campaign.imageUrl);
          campaign.imageUrl = campaign.imageUrl.concat(imageUrl);
        }
        campaign.imageUrl = imageUrl;
        }
        campaign.type = type;
        campaign.description = req.body.description;
        campaign.title = req.body.title;

        const updateCampaign = await campaign.save();
        res.status(200).json(updateCampaign);
    }catch(err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}

exports.deleteCampaign = async (req,res) => {
    const campaignId = req.params.campaignId;
    try{
        const campaign = await Campaign.findByIdAndDelete(
            {_id: campaignId}, 
        );
        if(!campaign){
            throw new Error("No campaigns found!");
        }
        clearImage(campaign.imageUrl[0]);
        res.status(200).json({message: "campaign successfully deleted."})
    }catch(err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

exports.getAssignedUsers = async (req, res) => {
    const { campaignId } = req.params;

    try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ msg: 'Campaign not found' });
        }

        const assignedUsers = campaign.assignedUsers; // Assuming assignedUsers is an array field in your Campaign model
        return res.status(200).json({ assignedUsers });
    } catch (error) {
        console.error('Error fetching assigned users:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
};

exports.assignUserToCampaign = async (req, res) => {
    const { campaignId, userId } = req.params;
    try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (campaign.assignedUsers.includes(userId)) {
            throw new Error('User is already assigned to this campaign');
        }

        campaign.assignedUsers.push(userId);
        await campaign.save();
        res.status(200).json({ message: 'User assigned to campaign successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.removeUserFromCampaign = async (req, res) => {
    const { campaignId, userId } = req.params;
    try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
        }
        if (!campaign.assignedUsers.includes(userId)) {
            throw new Error('User not found in assigned users');
        }
        campaign.assignedUsers.pull(userId);
        await campaign.save();
        res.status(200).json({ message: 'User removed from campaign successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err))
}
