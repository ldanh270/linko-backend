import express from "express"

const friendRouters = express.Router()

// List friends of current user
friendRouters.get("/", () => {})

// Unfriend
friendRouters.delete("/:id", () => {})

// List request that current user sent
friendRouters.get("/sent", () => {})

// Send friend request for specific user
friendRouters.post("/sent", () => {})

// List request that current user recieved
friendRouters.get("/recieved", () => {})

// Accept or Decline request
friendRouters.put("/recieved", () => {})

export default friendRouters
