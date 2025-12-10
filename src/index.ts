import dotenv from "dotenv"
import express from "express"

import { connectDB } from "./libs/database.ts"
import authRouters from "./routes/authRoutes.ts"
import conversationRouters from "./routes/conversationRoutes.ts"
import friendRouters from "./routes/friendRoutes.ts"
import userRouters from "./routes/userRoutes.ts"

/**
 * Server configurations
 */
dotenv.config() // Create config for using .env variables
const PORT = process.env.PORT || 5000 // Port where server runing on
const app = express()

/**
 * Middleware
 */

app.use(express.json())

/**
 * Main routers
 */

// Public routes
app.get("/", async (req, res) =>
    res.status(200).json({ message: "Connect to server successfully" }),
)

app.use("/api/auth", authRouters)

// Private routes
app.use("/api/conversations", conversationRouters)
app.use("/api/users", userRouters)
app.use("/api/friends", friendRouters)

/**
 * Must connect to database successfully before start server
 */
connectDB().then(() =>
    app.listen(PORT, () => {
        console.log("Server start on port " + PORT)
    }),
)
