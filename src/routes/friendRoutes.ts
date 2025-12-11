import express from "express"

const friendRoutes = express.Router()

// List friends of current user
friendRoutes.get("/", () => {})

// Unfriend
friendRoutes.delete("/:friendId", () => {})

// List request that current user sent
friendRoutes.get("/sent", () => {})

// Send friend request for specific user
friendRoutes.post("/sent", () => {})

// List request that current user received
friendRoutes.get("/received", () => {})

// Accept or Decline request
friendRoutes.put("/received", () => {})

export default friendRoutes
