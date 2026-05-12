import pool from "../config/database.js";
import "dotenv/config";
import {
  emailVerification,
  nameVerification,
  passwordVerification,
} from "../utils/regex.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    //Empty fields validation || Passed ✅
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields must be filled out" });
    }

    //Name regex validation || Passed ✅
    if (!nameVerification(firstName) || !nameVerification(lastName)) {
      return res.status(400).json({ message: "Invalid name. Try again" });
    }

    //Email validation || Passed ✅
    if (!emailVerification(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    //Password regex validation || Passed ✅
    if (!passwordVerification(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      });
    }

    //Passwords match validation || Passed ✅
    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const checkUser = await pool.query(
      `
      SELECT email FROM users
      WHERE email=$1
      `,
      [email],
    );

    //Existing user validation // Passed ✅
    if (checkUser.rowCount > 0) {
      return res.status(400).json("User already exist");
    }

    //Hash password after password validation
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `
      INSERT INTO users(first_name, last_name, email, password)
      VALUES($1, $2, $3, $4) RETURNING email, id
      `,
      [firstName, lastName, email, hashedPassword],
    );

    const token = jwt.sign(
      { userId: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({ message: "Registration successful", token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUSer = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Input fields validation || Passed ✅
    if (!email || !password) {
      return res.status(400).json({ message: "All fields must be completed" });
    }

    //Valid email validation || Passed ✅
    if (!emailVerification(email)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Query user data
    const potentialUser = await pool.query(
      `
      SELECT id, email, password, role FROM users
      WHERE email=$1
      `,
      [email],
    );

    //Check if user exists
    if (potentialUser.rowCount === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Decrypt password to compare with password input by user
    const hashedPassword = await bcrypt.compare(
      password,
      potentialUser.rows[0].password,
    );

    //Password match validation || Passed ✅
    if (!hashedPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //Save user data in token upon successful authentication
    const token = jwt.sign(
      {
        userId: potentialUser.rows[0].id,
        email: potentialUser.rows[0].email,
        role: potentialUser.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
