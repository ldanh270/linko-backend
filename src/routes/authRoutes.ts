import express from "express"

import { SignUpController } from "../controllers/authController.ts"
import validate from "../middlewares/validate.ts"
import { signupSchema } from "../schemas/authSchema.ts"

const authRoutes = express.Router()

// Signup
authRoutes.post("/signup", validate(signupSchema), SignUpController)

// Login
authRoutes.post("/login", () => {})

// Logout
authRoutes.post("/logout", () => {})

// Use Refresh token to get Access token
authRoutes.post("/refresh-token", () => {})

export default authRoutes
