const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/authDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(express.json()); // For parsing JSON
app.use(cors()); // Enable CORS for all origins

// Routes
app.post("/api/auth/signup", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    // Save to MongoDB
    try {
        const newUser = new User({ username, email, password });
        await newUser.save(); // Save the user in the database
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "Email already exists." });
        } else {
            res.status(500).json({ message: "Server error", error });
        }
    }
});
app.post("/api/auth/signin", async (req, res) => {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up." });
        }

        // Check password
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password." });
        }

        res.status(200).json({ message: "Signin successful!", user: { username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

