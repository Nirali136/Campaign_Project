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