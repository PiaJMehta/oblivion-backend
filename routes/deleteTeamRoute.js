const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/tokenAuthentication.js");
const deleteTeam = require("../controllers/deleteTeamController");

router.delete("/:teamId", authenticateToken, deleteTeam);

module.exports = router;
