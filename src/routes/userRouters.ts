import express from "express"

const userRouter = express.Router()

// View profile user
userRouter.get("/:id", () => {})

// Create user account
userRouter.post("/", () => {})

// Update user data
userRouter.put("/:id", () => {})

// Delete user account
userRouter.delete("/:id", () => {})

export default userRouter
