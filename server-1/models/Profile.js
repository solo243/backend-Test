const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    userprofile: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

},{
    timestamps: true 
});

module.exports = mongoose.model("Profile", profileSchema);
