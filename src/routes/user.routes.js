const express = require("express");
const UserController = require("../controllers/user.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const roleRestriction = require("../middlewares/roleRestriction");
const User = require("../models/user.models");

const userRoutes = express.Router();

userRoutes.post("/login", UserController.loginUser);
userRoutes.post(
  "/register",
  isAuthenticated(User),
  roleRestriction("admin"),
  UserController.addUser
);
userRoutes.put(
  "/update-password",
  isAuthenticated(User),
  UserController.updatePassword
);
userRoutes.get(
  "/get-all",
  isAuthenticated(User),
  roleRestriction("admin"),
  UserController.getAllNormalUser
);
userRoutes.get(
  "/get-single",
  isAuthenticated(User),
  UserController.getSingleUser
);
userRoutes.put("/remove", isAuthenticated(User), UserController.removeUser);
userRoutes.get(
  "/deleted-user",
  isAuthenticated(User),
  roleRestriction("admin"),
  UserController.showDeletedUsers
);

module.exports = userRoutes;
