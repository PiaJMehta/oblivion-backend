//database connection
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("Error connecting to database. Error = ", err);
  });

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// set templating engine (used for reset-password endpoint)
app.set("view engine", "ejs");

// ROUTING
const authRoute = require("./routes/authRoutes");
const registerRoute = require("./routes/registerRoutes");
const profileRoute = require("./routes/profileRoute");
const joinTeamRoute = require("./routes/joinTeamRoute");
const getTeamsRoute = require("./routes/getTeamsRoute");
const deleteTeamRoute = require("./routes/deleteTeamRoute");
const passwordRoutes = require("./routes/passwordRoutes");

app.use("/auth", authRoute);
app.use("/register", registerRoute);
app.use("/profile", profileRoute);
app.use("/joinTeam", joinTeamRoute);
app.use("/getTeams", getTeamsRoute);
app.use("/deleteTeam", deleteTeamRoute); // ← removed duplicate
app.use("/password", passwordRoutes);

// Listen
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
