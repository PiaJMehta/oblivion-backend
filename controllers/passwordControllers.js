const nodemailer = require("nodemailer");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//send mail setup
//create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.IEEE_EMAIL, //sender gmail address
    pass: process.env.APP_PASSWORD, //app password from gmail account
  },
});

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
    const link = `https://dsbackend.ieeemanipal.com/password/reset/${user._id}/${token}`;
    // const link = `http://localhost:3000/password/reset/${user._id}/${token}`;

    const mailOptions = {
      from: {
        name: "Dreamscape IEEESBM",
        address: process.env.IEEE_EMAIL,
      },
      to: user.email,
      subject: "Password Reset Link",
      text:
        `Dear ${user.name},\n\n` +
        "You are receiving this email because a password reset request was made for your account.\n\n" +
        "Please click on the link below or paste this into your browser to enable account access:\n" +
        `${link}\n\n` +
        "Note: This link is valid for 5 minutes.\n\n" +
        "If you did not request a password reset, please ignore this message.\n\n" +
        "Best regards,\n" +
        "Dreamscape Dev Team, IEEESBM",
      html: `<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <img src="https://dreamscape.ieeemanipal.com/assets/dreamscape-logo-Ch6qICn0.png" alt="Dreamscape Logo" width="400" style="display: block; margin: 0 auto; margin-bottom: 20px;">
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
              Dreamscape Dev Team, <strong>IEEESBM</strong>
            </p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
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
      // return res.status(401).json({ error: "Invalid or expired token" });
      res.render("authenticationFailed", {
        message: "Invalid or expired token",
      });
    }
    const uniqueSecret = process.env.JWT_SECRET + user.password;
    jwt.verify(token, uniqueSecret, async (err, decodedToken) => {
      if (err) {
        // If the token is invalid or expired
        console.log("verification failed");
        // return res.status(401).json({ error: "Invalid or expired token" });
        res.render("authenticationFailed", {
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
          // return res.status(401).json({ error: "Invalid or expired token" });
          res.render("authenticationFailed", {
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
        // If the token is invalid or expired
        console.log("verification failed");
        return res.status(401).json({ error: "Invalid or expired token" });
      } else {
        const { email, id } = decodedToken;
        if (email == user.email && id == user._id) {
          //update the password
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          await user.save();
          // res.json({ message: "hogaya" });
          // res.redirect("https://dreamscape.ieeemanipal.com/");
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
    res
      .json(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

module.exports = { forgotPassword, resetPassword, updatePassword };
