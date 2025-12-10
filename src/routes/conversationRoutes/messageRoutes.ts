import express from "express"

const messageRoutes = express.Router({ mergeParams: true })

// List of newest messages in specific conversation
messageRoutes.get("/", () => {})

// Send new message to conversation
messageRoutes.post("/", () => {})

// Edit a specific message in conversation
messageRoutes.put("/:messageId", () => {})

// Delete a specific message in conversation
messageRoutes.delete("/:messageId", () => {})

export default messageRoutes
