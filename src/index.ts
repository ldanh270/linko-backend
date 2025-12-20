import { connectDB } from "#/libs/database"
import { globalErrorHandler } from "#/middlewares/globalErrorHandler"
import protectRoutes from "#/middlewares/protectRoutes"
import authRouters from "#/routes/auth.route"
import conversationRouters from "#/routes/conversation.route"
import friendRouters from "#/routes/friend.route"
import messageRoutes from "#/routes/message.route"
import userRouters from "#/routes/user.route"

import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"

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
app.use(cookieParser())

/**
 * Main routers
 */

// Public routes
app.get("/", async (req, res) =>
    res.status(200).json({ message: "Connect to server successfully" }),
)

app.use("/api/auth", authRouters)

// Private routes
app.use(protectRoutes)

app.use("/api/conversations", conversationRouters)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRouters)
app.use("/api/friends", friendRouters)

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    })
})

// Global error handler
app.use(globalErrorHandler)

/**
 * Must connect to database successfully before start server
 */
connectDB().then(() =>
    app.listen(PORT, () => {
        console.log("Server start on port " + PORT)
    }),
)
