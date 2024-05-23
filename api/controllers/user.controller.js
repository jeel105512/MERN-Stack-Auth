import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res, next) => {
  res.json({
    message: "Api is working!",
  });
};

export const update = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your accound!"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          photo: req.body.photo,
        },
      },
      { new: true }
    ); // 664a4570c1d4736b431ec9d2

    const { password, ...userInfo } = updatedUser._doc;
    res.status(200).json({
      success: true,
      status: 200,
      user: userInfo,
    });
  } catch (error) {
    next(error);
  }
};
