import express from "express"

import { sendDirectMessage, sendGroupMessage } from "../../controllers/message.controller"

const messageRoutes = express.Router({ mergeParams: true })

// List of newest messages in specific conversation
messageRoutes.get("/", () => {})

// Send new message to conversation
messageRoutes.post("/direct", sendDirectMessage)
messageRoutes.post("/group", sendGroupMessage)

// Edit a specific message in conversation
messageRoutes.put("/:messageId", () => {})

// Delete a specific message in conversation
messageRoutes.delete("/:messageId", () => {})

export default messageRoutes
