const express = require("express")
const isAuthenticated = require("../middlewares/isAuthenticated")
const User = require("../models/user.models")
const roleRestriction = require("../middlewares/roleRestriction")
const SodEodController = require("../controllers/sodEod.controller")

const sodEodRoutes = express.Router()

sodEodRoutes.post("/create-sod-eod", isAuthenticated(User), roleRestriction("user"), SodEodController.addSodEod)
sodEodRoutes.get("/get-all", isAuthenticated(User), SodEodController.getAllSodEod)

module.exports =sodEodRoutes