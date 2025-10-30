import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    require: true,
    unique: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
    expires: 86400, //24 hours
  }
});

export const blacklistTokenModel = mongoose.model(
  "BlacklistToken",
  blacklistTokenSchema
);
