const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/passwordControllers");

router.post("/forgot", forgotPassword);
router.get("/reset/:id/:token", resetPassword);
router.post("/reset/:id/:token", updatePassword); //this route is directly called after new password form  is submitted, because it has the same address with post instead of get

module.exports = router;
