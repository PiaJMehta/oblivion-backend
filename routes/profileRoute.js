const express = require("express");
const authenticateToken = require("../middlewares/tokenAuthentication");
const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
  return res.json(req.user);
});

module.exports = router;
