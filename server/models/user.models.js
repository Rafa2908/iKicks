import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required."],
      minLength: [2, "First name must be at least 2 characters long."],
    },
    last_name: {
      type: String,
      required: [true, "Last name is required."],
      minLength: [2, "Last name must be at least 2 characters long."],
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    cartData: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  { timestamps: true }
);

UserSchema.virtual("confirm_password")
  .get(function () {
    return this._confirm_password;
  })
  .set(function (value) {
    this._confirm_password = value;
  });

UserSchema.pre("validate", function (next) {
  if (this.isModified("password") && this.password !== this.confirm_password) {
    this.invalidate("confirm_password", "Passwords must match.");
  }
  next();
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = model("User", UserSchema);

export default User;
