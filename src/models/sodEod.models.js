const mongoose = require("mongoose");

const SODEODSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    sodTime: {
        type: Date,
        default: null
    }, 
    eodTime: {
        type: Date,
        default:null
    }, 
    sodNote: {
        type: String,
        default: ""
    },
    eodNote: {
        type: String,
        default: ""
    },
}, {
    timestamps:true,
});

SODEODSchema.index({ userId: 1, date: 1 }, { unique: true });

const SODEOD = mongoose.model("SODEOD", SODEODSchema);
module.exports = SODEOD;
