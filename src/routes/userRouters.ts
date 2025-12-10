import express from "express"

const userRouters = express.Router()

// Get profile info of current user
userRouters.get("/me", () => {})

// View other user's profile
userRouters.get("/:userId", () => {})

// Search for users by query
userRouters.get("/search", () => {})

// Update current user profile details
userRouters.put("/me", () => {})

// Delete current user account
userRouters.delete("/", () => {})

export default userRouters
