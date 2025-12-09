import express from "express"

const authRouters = express.Router()

// Login
authRouters.post("/signup", () => {})

// Signup
authRouters.post("/login", () => {})

// Logout
authRouters.post("/logout", () => {})

// Use Refresh token to get Access token
authRouters.post("/refresh-token", () => {})

export default authRouters
