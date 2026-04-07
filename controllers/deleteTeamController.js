const Team = require("../models/teamModel");
const User = require("../models/userModel");

const deleteTeam = async function (req, res) {
  try {
    const { teamId } = req.params;
    const user = req.user; // set by authentication middleware

    // Check if the user is the leader of the team to be deleted
    const team = await Team.findOne({ teamId: teamId, leader_id: user._id });
    if (!team) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this team." });
    }

    // Delete the team from the Team collection
    await Team.deleteOne({ teamId });

    // Remove references to the deleted team from the Users collection
    // await User.updateMany({ $pull: { event: { teamId } } });
    await User.updateMany(
      { "event.teamId": teamId },
      { $pull: { event: { teamId } } }
    );

    // Send a success response
    //get the latest user object
    const userLatest = await User.findOne({ _id: user._id });
    return res.status(200).json(userLatest);
  } catch (ex) {
    console.error("Error deleting team:", ex);
    return res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
};

module.exports = deleteTeam;
