import express from "express"

import { login, logout, refreshToken, signup } from "../controllers/auth.controller"
import validate from "../middlewares/validate"
import { loginSchema, signupSchema } from "../schemas/auth.schema"

const authRoutes = express.Router()

// Signup
authRoutes.post("/signup", validate(signupSchema), signup)

// Login
authRoutes.post("/login", validate(loginSchema), login)

// Logout
authRoutes.post("/logout", logout)

// Use Refresh token to get Access token
authRoutes.post("/refresh-token", refreshToken)

export default authRoutes
