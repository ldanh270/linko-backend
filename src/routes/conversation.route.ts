import express from "express"

import participantRoutes from "./conversationRoutes/participant.route"
import messageRoutes from "./message.route"

const conversationRoutes = express.Router()

// List of recent conversations
conversationRoutes.get("/", () => {})

// Group/Conversation info
conversationRoutes.get("/:conversationId", () => {})

// Create new conversation (Only for group conversation)
conversationRoutes.post("/", () => {})

// Update conversation/group info
conversationRoutes.put("/:conversationId", () => {})

// Delete Group
conversationRoutes.delete("/:conversationId", () => {})

// Delete conversation history (Only for current user)
conversationRoutes.delete("/:conversationId/history", () => {})

// Participants (Members)
conversationRoutes.use("/:conversationId/participants", participantRoutes)

export default conversationRoutes
