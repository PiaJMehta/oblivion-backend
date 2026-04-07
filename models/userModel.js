const mongoose = require("mongoose");

const event = new mongoose.Schema({
  id: { type: Number, required: true },
  isIndividual: { type: Boolean, required: true }, //true for individual event
  teamId: { type: String, required: false },
  teamIsLeader: { type: Boolean, required: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: false, unique: false },
  collegeName: { type: String, required: true },
  membershipNo: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  event: { type: [event], required: false },
});

// Add timestamps option //this will add createdAt, updatedAt in the mongodb database.
userSchema.set("timestamps", true);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
