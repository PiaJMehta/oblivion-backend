const express = require("express");
const router = express.Router();

const register = require("../controllers/registerControllers.js");

const authenticateToken = require("../middlewares/tokenAuthentication.js");

router.post("/", authenticateToken, register);

module.exports = router;
