const mongoose = require('mongoose');

const vote = new mongoose.Schema({
    eId: {
        type: String,
        required: true
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

vote.index({eId : 1, position : 1, candidate : 1, voter : 1}, {unique : true});
const Votes = mongoose.model('Vote', vote);
module.exports = Votes;