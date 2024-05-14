import { timeStamp } from "console";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: [String, "You must provide a user name"],
      required: true,
      unique: true,
    },
    email: {
      type: [String, "You must provide a user email"],
      required: true,
      unique: true,
    },
    password: {
      type: [String, "You must provide a user password"],
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;