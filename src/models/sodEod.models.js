const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["todo", "inprogress", "done"],
        default: "todo"
    }
});

const SODEODSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    sod: {
        time: { type: Date, default: null },
        tasks: [TaskSchema]
    },
    eod: {
        time: { type: Date, default: null },
        tasks: [TaskSchema]
    }
}, {
    timestamps: true
});

SODEODSchema.index({ userId: 1, date: 1 }, { unique: true });

const SODEOD = mongoose.model("SODEOD", SODEODSchema);
module.exports = SODEOD;
