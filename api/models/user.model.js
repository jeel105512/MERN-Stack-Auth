import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You must provide a user name"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "You must provide a user email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "You must provide a user password"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;