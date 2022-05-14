const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, trim: true },
    role: {
      type: String,
      default: "user",
    },
    tokens: {
      access_token: {
        token: String,
        issued_at: Date,
        expires_in: Date,
      },
      refresh_token: {
        token: String,
        issued_at: Date,
        expires_in: Date,
      },
    },
    avatar: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
