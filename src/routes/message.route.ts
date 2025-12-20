import { sendMessage } from "#/controllers/message.controller"

import express from "express"

const messageRoutes = express.Router()

// List of newest messages in specific conversation
messageRoutes.get("/:conversationId", () => {})

// Send new message to conversation
messageRoutes.post("/", sendMessage)

// Edit a specific message in conversation
messageRoutes.put("/:messageId", () => {})

// Delete a specific message in conversation
messageRoutes.delete("/:messageId", () => {})

export default messageRoutes
