const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  eventId: {
    type: Number,
    ref: "Event",
    required: true,
  },
  leader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  leader_name: {
    type: String,
    required: true,
  },
  members: {
    type: [{ id: { type: mongoose.Schema.ObjectId }, name: { type: String } }],
    required: false,
  },
  maxTeamSize: {
    type: Number,
    required: true,
  },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
