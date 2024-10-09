import { initialize } from "../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
    // Ensure the database is initialized
    await initialize();

    // Use the User model defined in the initialization process
    const User = mongoose.model("User");

    if (req.method === "GET") {
        // Fetch all users
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({ error: "Unable to fetch users" });
        }
    } else if (req.method === "POST") {
        // Add a new user
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: "Username and password are required" });
            }
            const newUser = new User({ username, password });
            await newUser.save();
            res.status(201).json({ message: "User created successfully", user: newUser });
        } catch (err) {
            console.error("Error creating user:", err);
            res.status(500).json({ error: "Unable to create user" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
