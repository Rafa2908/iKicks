import User from "../models/user.models.js"; //User model
import dotenv from "dotenv";
import bcrypt from "bcrypt"; //Encrypt password
import jwt from "jsonwebtoken"; // Create token
import validator from "validator"; // validator to validate email
import { sendEmail } from "../emails/sendEmail.js";

dotenv.config();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, password, confirm_password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exist.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const newUser = new User({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      confirm_password: confirm_password,
    });

    await newUser.save();

    sendEmail(newUser);

    const token = createToken(newUser._id);

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

export const loginUSer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found. Please register." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = createToken(user._id);
    res
      .status(200)
      .json({ success: true, message: "You logged in successfully", token });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};
