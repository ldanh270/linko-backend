import express from "express"

const authRoutes = express.Router()

// Login
authRoutes.post("/signup", () => {})

// Signup
authRoutes.post("/login", () => {})

// Logout
authRoutes.post("/logout", () => {})

// Use Refresh token to get Access token
authRoutes.post("/refresh-token", () => {})

export default authRoutes
