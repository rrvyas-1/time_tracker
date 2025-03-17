const asyncHandler = require("express-async-handler");
const SODEOD = require("../models/sodEod.models");
const { ApiResponse } = require("../utils/responseHandler");
const logger = require("../utils/logger");
const User = require("../models/user.models");

const SodEodController = {
    addSodEod: asyncHandler(async (req, res) => {
        const { type, note } = req.body
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        let todaysEntry = await SODEOD.findOne({ userId: req.userAuth._id, date: startOfDay })
        if (!todaysEntry) {
            if (type === "SOD") {
                userFound = await User.findById(req.userAuth._id).select("workDetails")
                entry = await SODEOD.create({
                    userId: req.userAuth._id,
                    date: startOfDay,
                    sodTime: new Date(),
                    sodNote: note
                })
                userFound.workDetails.push(entry._id);
                await userFound.save()
                return ApiResponse.success(res, "SOD Recorded successfully", entry, 201)
            } else {
                return ApiResponse.error(res, "SOD is required before EOD", 400)
            }
        }
        
        if (type === "SOD" && todaysEntry.sodTime) {
            return ApiResponse.error(res,"SOD already recorded today",400)
        }
        if (type === "EOD" && todaysEntry.eodTime) {
            return ApiResponse.error(res, "EOD already recorded today", 400)
        }
        if (type === "SOD") {
            todaysEntry.sodTime = new Date();
            todaysEntry.sodNote = note || "";
        } else if (type === "EOD") {
            todaysEntry.eodTime = new Date();
            todaysEntry.eodNote = note || "";
        }
        await todaysEntry.save();
        return ApiResponse.success(res,`${type} Recorded`,todaysEntry)

    }),

}

module.exports = SodEodController;
