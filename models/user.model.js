import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userShcema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
});

userShcema.method.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_TOKEN_SECRET);
  return token;
};

userShcema.method.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userShcema.statics.hashpassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

export const userModel = mongoose.model("user", userShcema);
