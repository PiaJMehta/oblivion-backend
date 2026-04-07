const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/tokenAuthentication");
const getTeamsController = require("../controllers/getTeamsController");

router.get("/", authenticateToken, getTeamsController);

module.exports = router;
