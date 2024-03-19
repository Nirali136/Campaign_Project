const User = require('../models/user');
// const bcrypt = require('bcryptjs');

exports.getSignup = async  (req, res) => {
    try{
        const user = await User.find();
        if(!user){
            throw new Error("No user found!");
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
};

exports.postSignup = async (req, res) => {

    const user = new User(req.body);
    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
}

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(404).json({ message: "User not found or invalid credentials" });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
            if(err){
                res.status(500).json({ message: "Session could not be saved" });
            }else{
                res.status(200).json({ message: "Login successful", user });
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getLogin = async (req, res) => {
    res.status(200).json({ message: "Login page" });
}

exports.postLogout = (req, res) => {
    req.session.destroy(err=> {
        if(err){
            res.status(500).json({ message: "Error occurred during logout", error: err });
        } else {
            res.status(200).json({ message: "Logout successful" });
        }
    });
}