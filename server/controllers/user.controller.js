import pool from "../config/database.js";
import "dotenv/config";
import {
  emailVerification,
  nameVerification,
  passwordVerification,
} from "../utils/regex.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  sendPasswordResetCode,
  sendRegistrationConfirmation,
} from "../emails/email.js";
import { client } from "../utils/redisClient.js";

export const registerUser = async (req, res, next) => {
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

    await pool.query("BEGIN");

    const checkUser = await pool.query(
      `
      SELECT email FROM users
      WHERE email=$1
      `,
      [email],
    );

    //Existing user validation // Passed ✅
    if (checkUser.rowCount > 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json("User already exist");
    }

    //Hash password after password validation
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `
      INSERT INTO users(first_name, last_name, email, password)
      VALUES($1, $2, $3, $4) RETURNING email, id, first_name, role
      `,
      [firstName, lastName, email, hashedPassword],
    );

    await pool.query(
      `
      INSERT INTO cart(user_id)
      VALUES($1)
      `,
      [newUser.rows[0].id],
    );

    if (newUser.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({ message: "Error signing up" });
    }

    await client.rPush(
      "queue:email",
      JSON.stringify({
        type: "register",
        to: newUser.rows[0].email,
        data: { name: newUser.rows[0].first_name },
      }),
    );

    const token = jwt.sign(
      {
        userId: newUser.rows[0].id,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await pool.query("COMMIT");

    return res.status(201).json({
      message: "Registration successful",
      userId: newUser.rows[0].id,
      email: newUser.rows[0].email,
      role: newUser.rows[0].role,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
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
      SELECT id, first_name, last_name, email, password, role 
      FROM users
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
    const accessToken = jwt.sign(
      {
        userId: potentialUser.rows[0].id,
        email: potentialUser.rows[0].email,
        role: potentialUser.rows[0].role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      {
        userId: potentialUser.rows[0].id,
        email: potentialUser.rows[0].email,
        role: potentialUser.rows[0].role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    const userData = {
      id: potentialUser.rows[0].id,
      email: potentialUser.rows[0].email,
      role: potentialUser.rows[0].role,
      first_name: potentialUser.rows[0].first_name,
      last_name: potentialUser.rows[0].last_name,
    };

    const key = `user:${potentialUser.rows[0].id}:profile`;

    await client.set(key, JSON.stringify(userData), { EX: 3600 });

    await client.set(`refresh:${potentialUser.rows[0].id}`, refreshToken, {
      EX: 604800,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Logged in successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  const { userId } = req.user;

  try {
    await client.del(`refresh:${userId}`);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return next(error);
  }
};
export const getMe = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized." });
  }
  const { userId } = req.user;

  try {
    const key = `user:${userId}:profile`;

    const cache = await client.get(key);

    if (cache) {
      return res.status(200).json(JSON.parse(cache));
    }

    const user = await pool.query(
      `SELECT id, first_name, last_name, email, role FROM users WHERE id=$1`,
      [userId],
    );

    if (user.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    await client.set(key, JSON.stringify(user.rows[0]), { EX: 3600 });

    return res.status(200).json(user.rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await pool.query(`
    SELECT email, first_name, last_name, role
    FROM users
    `);

    if (users.rowCount === 0)
      return res.status(404).json({ message: "Data not available" });

    return res.status(200).json(users.rows);
  } catch (error) {
    return next(error);
  }
};

export const updateUserInfo = async (req, res, next) => {
  const { userId } = req.user;
  const { firstName, lastName, email } = req.body;

  try {
    if (!firstName || !lastName || !email)
      return res.status(404).json({ message: "All fields must be filled out" });

    if (!emailVerification(email)) {
      return res.status(400).json({ message: "Invalid email provided" });
    }

    const update = await pool.query(
      `
      UPDATE users
      SET first_name=$1, last_name=$2, email=$3
      WHERE id=$4
      RETURNING id
      `,
      [firstName, lastName, email, userId],
    );

    if (update.rowCount === 0) {
      return res.status(400).json({ message: "Error updating profile" });
    }

    const key = `user:${userId}:profile`;

    await client.del(key);

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export const activateUserAccount = async (req, res, next) => {
  const { userId } = req.user;

  try {
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
    return next(error);
  }
};

export const deactivateUserAccount = async (req, res, next) => {
  const { userId } = req.user;

  try {
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
    return next(error);
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

    const userId = user.rows[0].id;

    if (user.rowCount > 0) {
      await pool.query(`DELETE FROM password_reset WHERE user_id=$1`, [userId]);

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiration = new Date(Date.now() + 15 * 60 * 1000);

      const hashedCode = await bcrypt.hash(code, 10);

      await pool.query(
        `
      INSERT INTO password_reset(user_id, reset_code, code_expiration)
      VALUES($1, $2, $3)
      `,
        [userId, hashedCode, expiration],
      );

      await client.rPush(
        "queue:email",
        JSON.stringify({
          type: "password",
          to: email,
          data: { tempCode: code },
        }),
      );
    }

    return res
      .status(200)
      .json({ message: "Temporary code sent", userId: userId });
  } catch (error) {
    return next(error);
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
      SELECT pr.reset_code, pr.code_expiration, u.email 
      FROM password_reset pr
      JOIN users u 
      ON pr.user_id=u.id 
      WHERE pr.user_id=$1
      `,
      [userId],
    );

    if (user.rowCount === 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const date = new Date();
    const expiration = user.rows[0].code_expiration;
    const userData = user.rows[0];

    if (date > expiration) {
      await pool.query(`DELETE FROM password_reset WHERE user_id=$1`, [userId]);
      return res
        .status(400)
        .json({ message: "Code expired. Please request new code." });
    }

    const isValid = await bcrypt.compare(resetCode, userData.reset_code);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid temporary code" });
    }

    const resetToken = jwt.sign(
      { email: userData.email, purpose: "password-reset" },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("resetToken", resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({ message: "Code verified" });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res) => {
  const { resetToken } = req.cookies;
  const { newPassword, confirmPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_ACCESS_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const email = decoded.email;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields must be filled out" });
    }

    if (!passwordVerification(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, 1 uppercase, 1 lowercase, 1 number, and 1 special character ",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("BEGIN");

    const update = await pool.query(
      `
      UPDATE users SET password=$1 WHERE email=$2 RETURNING id
      `,
      [hashedPassword, email],
    );

    if (update.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(400).json({ message: "Error resetting password" });
    }

    await pool.query(
      `
      DELETE FROM password_reset WHERE user_id=$1
      `,
      [update.rows[0].id],
    );

    res.clearCookie("resetToken");

    const user = await pool.query(
      `SELECT id, email, role FROM users WHERE email=$1`,
      [email],
    );

    const accessToken = jwt.sign(
      {
        userId: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      {
        userId: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await pool.query("COMMIT");

    await client.set(`refresh:${user.rows[0].id}`, refreshToken, {
      EX: 604800,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    return next(error);
  }
};
