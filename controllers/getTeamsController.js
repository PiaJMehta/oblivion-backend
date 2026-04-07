const Team = require("../models/teamModel");
const getTeams = async function (req, res) {
  try {
    const user = req.user; //this is set by authentication middleware

    //find teams in which user is present, either as member or as leader
    const teams = await Team.find({
      $or: [
        { "members.id": user._id }, // User is a member of the team
        { leader_id: user._id }, // User is the leader of the team
      ],
    });

    res.status(200).json(teams);
  } catch (ex) {
    console.error(ex);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later" });
  }
};

module.exports = getTeams;
