const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Campaign = require('../models/campaign');
const User = require('../models/user');

exports.getAllUserIds = async (req, res) => {
    try{
        const users = await  User.find({}, '_id');
        let userIds = users.map(user=> user._id);
        return res.status(200).json({userIds: userIds});
    } catch(err){
        console.log(err);
        return res.status(500).json({msg:"Server error"});
    }
}

exports.deleteUser = async (req,res)=>{
    const userId = req.params.userId;
    try {
        const campaigns = await Campaign.find({ "assignedUsers.userId": userId });

        // If the user's ID is found in any campaign, prevent the deletion
        if (campaigns.length > 0) {
            return res.status(400).json({ msg: "Cannot delete user as the user is assigned to one or more campaigns." });
        }

        await User.findByIdAndDelete(userId);
        return res.status(200).json({ msg: "User deleted successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
}