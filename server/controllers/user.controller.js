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

    return res.status(201).json(newUser, token);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
