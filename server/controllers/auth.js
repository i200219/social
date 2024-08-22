import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // Validate input fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "Please provide all required fields." });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use." });
        }

        // Generate a salt and hash the password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Respond with the created user
        res.status(201).json(savedUser);
    } catch (error) {
        // Log the error and respond with a generic message
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        // Check if user exists and password is correct
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }
          // Check if passwords match
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });

    } catch (error) {
        // Log the error and respond with a generic message
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};
        
