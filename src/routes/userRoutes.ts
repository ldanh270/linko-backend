import express, { Request, Response } from "express"

const userRoutes = express.Router()

// Get profile info of current user
userRoutes.get("/me", (req: Request, res: Response) => {
    res.status(200).json({
        message: "OK",
    })
})

// Search for users by query
userRoutes.get("/search", () => {})

// View other user's profile
userRoutes.get("/:userId", () => {})

// Update current user profile details
userRoutes.put("/me", () => {})

// Delete current user account
userRoutes.delete("/", () => {})

export default userRoutes
