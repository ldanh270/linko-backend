import express from "express"

const messageRouters = express.Router({ mergeParams: true })

// List of newest messages in specific conversation
messageRouters.get("/", () => {})

// Send new message to conversation
messageRouters.post("/", () => {})

// Edit a specific message in conversation
messageRouters.put("/:messageId", () => {})

// Delete a specific message in conversation
messageRouters.delete("/:messageId", () => {})

export default messageRouters
