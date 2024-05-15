import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ success: true, status: 201, newUser });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
