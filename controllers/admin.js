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
    const campaign = new Campaign(req.body);
    const errors = validationResult(req);
    try{
        if (campaign.type === 'private') {
            if (!campaign.assignedUsers || campaign.assignedUsers.length === 0) {
                return res.status(400).json({ message: 'Assigned users are required for private campaigns.' });
            }
        } else {
            campaign.assignedUsers = undefined; 
        }
        const newCapaign = await campaign.save();
        res.status(201).json(newCapaign);
    }catch(err){
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
    try{
        const campaign = await Campaign.findByIdAndUpdate(
            {_id: campaignId}, 
            req.body,
            {new: true}
        );
        if(!campaign){
            throw new Error("No campaigns found!");
        }
        res.status(200).json(campaign);
    }catch(err) {
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
        res.status(200).json({message: "campaign successfully deleted."})
    }catch(err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.assignUserToCampaign = async (req, res) => {
    const { campaignId, userId } = req.params;
    try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            throw new Error('Campaign not found');
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
        campaign.assignedUsers.pull(userId);
        await campaign.save();
        res.status(200).json({ message: 'User removed from campaign successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
