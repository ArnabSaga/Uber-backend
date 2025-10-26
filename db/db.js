import mongoose from 'mongoose';

function connectToDB() {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.error("DB connection error:", err));
}

export default connectToDB;
