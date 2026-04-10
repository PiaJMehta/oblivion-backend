const { Resend } = require("resend");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const resend = new Resend(process.env.RESEND_API_KEY);

const forgotPassword = async function (req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(200).json({
      message:
        "If you're registered, you'll receive a password reset email shortly. Don't forget to check your spam folder.",
    });
  }
  try {
    const uniqueSecret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, uniqueSecret, {
      expiresIn: "5m",
    });
    const link = `${process.env.BACKEND_URL}/password/reset/${user._id}/${token}`;

    await resend.emails.send({
      from: "Oblivion IEEESBM <onboarding@resend.dev>",
      to: user.email,
      subject: "Password Reset Link",
      html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <img src="https://dreamscape.ieeemanipal.com/assets/dreamscape-logo-Ch6qICn0.png" alt="Oblivion Logo" width="400" style="display: block; margin: 0 auto; margin-bottom: 20px;">
            <p>Dear ${user.name},</p>
            <p>You are receiving this email because a password reset request was made for your account.</p>
            <p>Please click on the link below or paste this into your browser to enable account access:</p>
            <div style="margin-top: 20px;">
              <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease;margin: 0 auto;">Reset Password</a>
              <br>
              <span>${link}</span>
            </div>
            <p style="margin-top: 20px; font-weight: bold;">Note: This link is valid for 5 minutes.</p>
            <p>If you did not request a password reset, please ignore this message.</p>
            <p style="margin-top: 20px;">
              Best regards,<br>
              Oblivion Dev Team, <strong>IEEESBM</strong>
            </p>
        </div>`,
    });

    console.log(link);
    console.log("Email has been sent successfully");
    return res.status(200).json({
      message:
        "If you're registered, you'll receive a password reset email shortly. Don't forget to check your spam folder.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "An error occured while sending email. Please contact admin",
    });
  }
};

const resetPassword = async function (req, res) {
  try {
    const { id, token } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      console.log("no user found");
      return res.render("authenticationFailed", {
        message: "Invalid or expired token",
      });
    }
    const uniqueSecret = process.env.JWT_SECRET + user.password;
    jwt.verify(token, uniqueSecret, async (err, decodedToken) => {
      if (err) {
        console.log("verification failed");
        return res.render("authenticationFailed", {
          message: "Invalid or expired token",
        });
      } else {
        const { email, id } = decodedToken;
        if (email == user.email && id == user._id) {
          res.render("updatePassword", {
            name: user.name,
            email: email,
            status: false,
          });
        } else {
          console.log("Don't act smart");
          return res.render("authenticationFailed", {
            message: "Invalid or expired token",
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.render("authenticationFailed", {
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const updatePassword = async function (req, res) {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ _id: id });
    if (!user) {
      console.log("no user found");
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    const uniqueSecret = process.env.JWT_SECRET + user.password;
    jwt.verify(token, uniqueSecret, async (err, decodedToken) => {
      if (err) {
        console.log("verification failed");
        return res.status(401).json({ error: "Invalid or expired token" });
      } else {
        const { email, id } = decodedToken;
        if (email == user.email && id == user._id) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          await user.save();
          res.render("updatePassword", {
            name: user.name,
            email: email,
            status: true,
          });
        } else {
          console.log("Don't act smart");
          return res.status(401).json({ error: "Invalid or expired token" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

module.exports = { forgotPassword, resetPassword, updatePassword };