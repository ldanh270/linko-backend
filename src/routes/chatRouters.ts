import express from "express"

const chatRouters = express.Router()

// Get chat messages
chatRouters.get("/:id", () => {})

// Create chat (When add friend)
chatRouters.post("/", () => {})

// Edit chat (When send messages or add prople to group chat)
chatRouters.put("/:id", () => {})

// Delete chat history
chatRouters.delete("/:id", () => {})

export default chatRouters
