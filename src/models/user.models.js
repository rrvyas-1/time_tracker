const mongoose  = require("mongoose");


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isAdmin: {
        type: Boolean,
        default:false
    },
    isVerified: {
        type: Boolean,
        default:false
    },
    loggedAt: {
        type: Date,
    },
    isRemoved: {
        type: Boolean,
        default:false
    },
    designation: {
        type: String,
        required:false
    },
    salary: {
        type: Number,
        required:false
    },
    workDetails: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"SODEOD"
    }]
}, {
    timestamps:true
})


const User = mongoose.model("User", userSchema)

module.exports = User;