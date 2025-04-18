const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profiles: [
    {
      name: String,
      email: String,
      phone: String,
      address1: String,
      address2: String,
      instagram: String,
      youtube: String,
      linkedin: String,
      github: String,
    },
  ],
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
