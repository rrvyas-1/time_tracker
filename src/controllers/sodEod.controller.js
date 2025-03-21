const asyncHandler = require("express-async-handler");
const SODEOD = require("../models/sodEod.models");
const { ApiResponse } = require("../utils/responseHandler");
const User = require("../models/user.models");

const SodEodController = {
  addSodEod: asyncHandler(async (req, res) => {
    const { type, tasks } = req.body;
    const userId = req.userAuth._id;
    const today = new Date();
    const date = new Date(today.setHours(0, 0, 0, 0));
    const userFound = await User.findById(req.userAuth._id).select(
      "workDetails"
    );

    let todaysEntry = await SODEOD.findOne({ userId, date });

    if (!todaysEntry) {
      if (type === "sod") {
        const entry = await SODEOD.create({
          userId,
          date,
          sod: {
            time: new Date(),
            tasks: tasks || [],
          },
          sodCreated: true,
        });
        userFound.workDetails.push(entry._id);
        await userFound.save();

        return ApiResponse.success(
          res,
          "SOD Recorded successfully",
          entry,
          201
        );
      } else {
        return ApiResponse.error(res, "SOD is required before EOD", 400);
      }
    }
    if (type === "sod" && todaysEntry.sod.time) {
      return ApiResponse.error(res, "SOD already recorded today", 400);
    }
    if (type === "eod" && todaysEntry.eod.time) {
      return ApiResponse.error(res, "EOD already recorded today", 400);
    }
    if (type === "sod") {
      todaysEntry.sod.time = new Date();
      if (tasks && tasks.length > 0) {
        todaysEntry.sod.tasks.push(...tasks);
        todaysEntry.sodCreated = true;
      }
    } else if (type === "eod") {
      todaysEntry.eod.time = new Date();
      if (tasks && tasks.length > 0) {
        todaysEntry.eod.tasks.push(...tasks);
        todaysEntry.eodCreated = true;
      }
    }

    await todaysEntry.save();
    return ApiResponse.success(
      res,
      `${type.toUpperCase()} Recorded`,
      todaysEntry
    );
  }),

  getAllSodEod: asyncHandler(async (req, res) => {
    const userId = req.userAuth._id;
    userFound = await User.findById(userId)
      .select("workDetails")
      .populate("workDetails");
    if (!userFound) {
      return ApiResponse.error(res, "No Data Found", 404);
    }
    return ApiResponse.success(res, "Data Found", userFound.workDetails);
  }),
};

module.exports = SodEodController;
