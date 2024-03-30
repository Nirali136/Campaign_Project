const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const campaignSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['public', 'private'],
        required: true
    },
    imageUrl: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        required: true
    },
    assignedUsers:[{
        type: String
    }]
});

module.exports = mongoose.model('Campaign', campaignSchema);


 // admin: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },