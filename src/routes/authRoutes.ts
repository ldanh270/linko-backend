import express from "express"

import { login, logout, signup } from "../controllers/authController.ts"
import validate from "../middlewares/validate.ts"
import { loginSchema, signupSchema } from "../schemas/authSchema.ts"

const authRoutes = express.Router()

// Signup
authRoutes.post("/signup", validate(signupSchema), signup)

// Login
authRoutes.post("/login", validate(loginSchema), login)

// Logout
authRoutes.post("/logout", logout)

// Use Refresh token to get Access token
authRoutes.post("/refresh-token", () => {})

export default authRoutes
