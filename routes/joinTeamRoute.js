const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/tokenAuthentication.js");
const joinTeam = require("../controllers/joinTeamController");

router.post("/", authenticateToken, joinTeam);

module.exports = router;
