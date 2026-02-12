import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

// Signup controller, Express route handler.
export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    // TODO: Make more robust password checker
    if (password.length < 6) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user using the info from the req body.
    const user = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    // Saves user to the MongoDB
    await user.save();

    // Create a jwt token, stores _id inside.
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.cookie("jwt-lockedOut", token, {
      httpOnly: true, //prevents XSS attack
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict", //prevents CSRF attack
      secure: process.env.NODE_ENV === "production", //prevents man in the middle attacks
    });

    res.status(201).json({ message: "User created successfully" });

    // Send welcome email
    const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`;

    try {
      await sendWelcomeEmail(user.email, user.name, profileUrl);
    } catch (emailError) {
      console.error("Error sending welcome email", emailError);
    }
  } catch (error) {
    console.log("Error in signup", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req, res) => {
  try {
  } catch (error) {}
};

export const logout = (req, res) => {
  try {
  } catch (error) {}
};
