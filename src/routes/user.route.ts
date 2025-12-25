import { UserController } from "#/controllers/user.controller"
import { UserService } from "#/services/user.service"

import express from "express"

const userRoutes = express.Router()

const service = new UserService()
const controller = new UserController(service)

// Get profile info of current user
userRoutes.get("/me", controller.getUserProfile)

// Search for users by query
userRoutes.get("/search", controller.searchUsers)

// View other user's profile
userRoutes.get("/:userId", controller.viewUserProfile)

// Update current user profile details
userRoutes.put("/me", () => {})

// Delete current user account
userRoutes.delete("/", () => {})

export default userRoutes
