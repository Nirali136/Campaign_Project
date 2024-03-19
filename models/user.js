const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type: String, 
        required: true,
    },
    mobile_No:{
        type: Number,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    }  
})

module.exports = mongoose.model( 'User', userSchema );