import mongoose from 'mongoose';

// Track the connection status
let isConnected = false;

// Define user schema once globally
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

// Function to initialize the database connection
export async function initialize() {
    // Use the MONGODB_URI from environment variables
    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
        throw new Error("Please define the MONGODB_URI environment variable in .env.local");
    }

    // If already connected, return the existing connection
    if (isConnected) {
        console.log("Already connected to MongoDB.");
        return;
    }

    try {
        // Establish a connection to the database
        const db = await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = db.connections[0].readyState;
        console.log("MongoDB connected successfully!");

        // Define the User model only if it doesn't exist
        if (!mongoose.models.User) {
            mongoose.model('User', userSchema);
        }

    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw new Error("Failed to connect to MongoDB");
    }
}
