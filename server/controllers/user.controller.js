import pool from "../config/database.js";
import "dotenv/config";
import {
  emailVerification,
  nameVerification,
  passwordVerification,
} from "../utils/regex.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../emails/email.js";

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

export const loginUser = async (req, res) => {
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

export const getAllUsers = async (req, res) => {
  try {
    const users = await pool.query(`
    SELECT email, first_name, last_name, role
    FROM users
    `);

    if (users.rowCount === 0)
      return res.status(404).json({ message: "Data not available" });

    return res.status(200).json(users.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await pool.query(
      `SELECT email, first_name, last_name FROM users WHERE id=$1`,
      [userId],
    );

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "No user data available" });
    }

    return res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email } = req.body;

  try {
    if (!firstName || !lastName || !email)
      return res.status(404).json({ message: "All fields must be filled out" });

    const user = await pool.query(
      `
      SELECT email FROM users WHERE id=$1
      `,
      [userId],
    );

    if (user.rowCount === 0)
      return res.status(404).json({ message: "No user data available" });

    const update = await pool.query(
      `
      UPDATE users
      SET first_name=$1, last_name=$2, email=$3
      WHERE id=$4
      `,
      [firstName, lastName, email, userId],
    );

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const activateUserAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const update = await pool.query(
      `
      UPDATE users SET is_active=true WHERE id=$1 RETURNING id
       `,
      [userId],
    );

    if (update.rowCount === 0) {
      return res
        .status(400)
        .json({ message: "Error activating account. Try again" });
    }

    return res.status(200).json({ message: "Account activated successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deactivateUserAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const update = await pool.query(
      `
      UPDATE users SET is_active=false WHERE id=$1 RETURNING id
       `,
      [userId],
    );

    if (update.rowCount === 0) {
      return res
        .status(400)
        .json({ message: "Error deactivating account. Try again" });
    }

    return res
      .status(200)
      .json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const generateCode = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(404).json({ message: "Field must be filled out" });
    }

    if (!emailVerification(email)) {
      return res.status(404).json({ message: "Invalid email" });
    }

    const user = await pool.query(
      `
      SELECT id FROM users WHERE email=$1
      `,
      [email],
    );

    if (user.rowCount === 0) {
      return res.status(400).json({ message: "No user data available" });
    }

    const userId = user.rows[0].id;

    const existingCode = await pool.query(
      `
      SELECT id FROM password_reset WHERE user_id=$1
      `,
      [userId],
    );

    if (existingCode.rowCount > 0) {
      await pool.query(`DELETE FROM password_reset WHERE user_id=$1`, [userId]);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `
      INSERT INTO password_reset(user_id, reset_code, code_expiration)
      VALUES($1, $2, $3)
      `,
      [userId, code, expiration],
    );

    await sendEmail(code);

    return res
      .status(200)
      .json({ message: "Temporary code sent", userId: userId });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyCode = async (req, res) => {
  const { userId, resetCode } = req.body;

  try {
    if (!userId || !resetCode) {
      return res.status(400).json({ message: "Data not provided" });
    }

    const user = await pool.query(
      `
      SELECT pr.reset_code, pr.code_expiration, u.email FROM password_reset pr
      JOIN users u ON pr.user_id=u.id 
      WHERE pr.user_id=$1
      `,
      [userId],
    );

    if (user.rowCount === 0) {
      return res.status(400).json({ message: "No user data available" });
    }

    const date = new Date();
    const expiration = user.rows[0].code_expiration;

    if (date > expiration) {
      await pool.query(`DELETE FROM password_reset WHERE user_id=$1`, [userId]);
      return res
        .status(400)
        .json({ message: "Code expired. Please request new code." });
    }

    if (resetCode !== user.rows[0].reset_code) {
      return res.status(400).json({ message: "Invalid temporary code" });
    }

    const resetToken = jwt.sign(
      { email: user.rows[0].email, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    return res.status(200).json({ resetToken });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({ message: "Not authorized" });
    }

    const email = decoded.email;

    if (!newPassword || !confirmPassword) {
      return res.status(404).json({ message: "All fields must be filled out" });
    }

    if (!passwordVerification(newPassword)) {
      return res.status(404).json({
        message:
          "Password must be at least 8 characters long, 1 uppercase, 1 lowercase, 1 number, and 1 special character ",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(404).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const update = await pool.query(
      `
      UPDATE users SET password=$1 WHERE email=$2 RETURNING id
      `,
      [hashedPassword, email],
    );

    if (update.rowCount === 0) {
      return res.status(400).json({ message: "Error resetting password" });
    }

    await pool.query(
      `
      DELETE FROM password_reset WHERE user_id=$1
      `,
      [update.rows[0].id],
    );

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
