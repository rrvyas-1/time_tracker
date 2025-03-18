const User = require("../models/user.models");
const asyncHandler = require("express-async-handler");
const { ApiResponse } = require("../utils/responseHandler");
const {
  hashPassword,
  generateToken,
  isPasswordMatched,
} = require("../utils/helper");

const UserController = {
  addUser: asyncHandler(async (req, res) => {
    const { userName, email, password, designation, salary } = req.body;
    const userNameOrEmailExists = await User.findOne({
      $or: [{ userName }, { email }],
    });
    if (userNameOrEmailExists)
      return ApiResponse.error(res, "User Already Exists", 409);

    const userCreated = await User.create({
      userName,
      email,
      password: await hashPassword(password),
      designation,
      salary,
    });

    return ApiResponse.success(
      res,
      "User Created Successfully",
      {
        userName: userCreated.userName,
        email: userCreated.email,
      },
      201
    );
  }),
  loginUser: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userFound = await User.findOne({
      $or: [{ userName: email }, { email: email }],
    });
    if (!userFound) return ApiResponse.error(res, "User not registered", 404);
    if (!(await isPasswordMatched(password, userFound.password)))
      return ApiResponse.error(res, "Password mismatched", 401);
    if (userFound.isVerified == false)
      return ApiResponse.error(res, "User is not verified", 401);
    if (userFound.isRemoved)
      return ApiResponse.error(res, "User no more available or deleted", 401);

    userFound.loggedAt = new Date();
    await userFound.save();
    return ApiResponse.success(res, "User Logged in Successfully", {
      userName: userFound.userName,
      email: userFound.email,
      token: generateToken(userFound._id),
      isAdmin: userFound.isAdmin,
    });
  }),
  updatePassword: asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userFound = await User.findById(req.userAuth._id);
    if (!(await isPasswordMatched(oldPassword, userFound.password)))
      return ApiResponse.error(res, "Your Old password not Match", 401);
    await User.findByIdAndUpdate(
      req.userAuth._id,
      {
        password: await hashPassword(newPassword),
      },
      { new: true }
    ).select("userName password");

    return ApiResponse.success(res, "Password Changed successfully", {
      userName: userFound.userName,
      email: userFound.email,
      token: generateToken(userFound._id),
      isAdmin: userFound.isAdmin,
    });
  }),
  getAllNormalUser: asyncHandler(async (req, res) => {
    const allNormalUser = await User.find({
      isAdmin: false,
      isRemoved: false,
    }).select("-password -__v");
    if (allNormalUser.length === 0)
      return ApiResponse.error(res, "Users Not Found", 404);
    return ApiResponse.success(
      res,
      "Users fetched successfully",
      allNormalUser
    );
  }),
  getSingleUser: asyncHandler(async (req, res) => {
    const userData = await User.find({
      _id: req.userAuth._id,
      isRemoved: false,
    }).select("-password -__v");
    if (userData.length === 0)
      return ApiResponse.error(res, "User data not found", 404);
    return ApiResponse.success(res, "User data fetched successfully", userData);
  }),
  removeUser: asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) userId = req.userAuth._id;
    const removedUser = await User.findByIdAndUpdate(
      userId,
      {
        isRemoved: true,
      },
      { new: true }
    ).select("-password -__v");
    return ApiResponse.success(
      res,
      "User deleted successfully",
      removedUser,
      200
    );
  }),
  showDeletedUsers: asyncHandler(async (req, res) => {
    const deletedUsers = await User.find({ isRemoved: true }).select(
      "-password -__v -isRemoved"
    );
    if (deletedUsers.length === 0)
      return ApiResponse.error(res, "No more deleted user", 404);
    return ApiResponse.success(
      res,
      "Deleted user fetched successfully",
      deletedUsers
    );
  }),
};

module.exports = UserController;
