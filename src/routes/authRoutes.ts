import express from "express"

import { SignUpController } from "../controllers/authController.ts"

const authRoutes = express.Router()

// Login
authRoutes.post("/signup", SignUpController)

// Signup
authRoutes.post("/login", () => {})

// Logout
authRoutes.post("/logout", () => {})

// Use Refresh token to get Access token
authRoutes.post("/refresh-token", () => {})

export default authRoutes
