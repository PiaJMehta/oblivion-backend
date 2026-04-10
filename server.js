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
    console.log("Error conntecting to database. Error = ", err);
  });

const app = express();
const port = process.env.PORT || 3000; 


// middleware;
app.use(
  cors({
    credentials: true,
    //origin: "https://dreamscape.ieeemanipal.com",
    // origin: "http://localhost:5173", //toggle for local testing
     origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//set templating engine (used for reset-password endpoint)
app.set("view engine", "ejs");

//ROUTING
const authRoute = require("./routes/authRoutes");
const registerRoute = require("./routes/registerRoutes");
const profileRoute = require("./routes/profileRoute");
const joinTeamRoute = require("./routes/joinTeamRoute");
const getTeamsRoute = require("./routes/getTeamsRoute");
const deleteTeamRoute = require("./routes/deleteTeamRoute");
const passwordRoutes = require("./routes/passwordRoutes");

app.use("/auth", authRoute);
app.use("/register", registerRoute);
app.use("/profile", profileRoute); //used to login user directly with the help of cookie/token in case of a page refresh
app.use("/joinTeam", joinTeamRoute);
app.use("/getTeams", getTeamsRoute); //used to return all the teams, the user is a part of
app.use("/deleteTeam", deleteTeamRoute); //used to delete a team from Teams collection as well as from all the users
app.use("/deleteTeam", deleteTeamRoute); //used to delete a team from Teams collection as well as from all the users
app.use("/password", passwordRoutes);

//Listen
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
