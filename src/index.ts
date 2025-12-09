import dotenv from "dotenv"
import express from "express"

import { connectDB } from "./config/database.ts"
import authRouters from "./routes/authRouters.ts"
import conversationRouters from "./routes/conversationRouters.ts"
import friendRouters from "./routes/friendRouters.ts"
import userRouters from "./routes/userRouters.ts"

/**
 * Server configurations
 */
dotenv.config() // Create config for using .env variables
const PORT = process.env.PORT || 5000 // Port where server runing on
const app = express()

/**
 * Main routers
 */
app.use("api/auth", authRouters)
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
