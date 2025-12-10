import express from "express"

const userRoutes = express.Router()

// Get profile info of current user
userRoutes.get("/me", () => {})

// View other user's profile
userRoutes.get("/:userId", () => {})

// Search for users by query
userRoutes.get("/search", () => {})

// Update current user profile details
userRoutes.put("/me", () => {})

// Delete current user account
userRoutes.delete("/", () => {})

export default userRoutes
