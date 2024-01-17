const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    score:{
        type:Number,
        require:true
    }
},{
    timestamps: true 
});

module.exports = mongoose.model("Deal", profileSchema);


