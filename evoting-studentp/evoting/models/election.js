const mongoose = require('mongoose');

const election = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    positions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Position'
        }
    ],
    scheduleTime : Date,
    endTime: Date
}, {
    timestamps: true
});

const Elections = mongoose.model('Election', election);
module.exports = Elections;