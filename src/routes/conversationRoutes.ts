import express from "express"

import messageRoutes from "./conversationRoutes/messageRoutes"
import participantRoutes from "./conversationRoutes/participantRoutes"

const conversationRoutes = express.Router()

/**
 * Conversation/Group
 */
// List of recent conversations
conversationRoutes.get("/", () => {})

// Group/Conversation info
conversationRoutes.get("/:conversationId/info", () => {})

// Create new conversation
conversationRoutes.post("/", () => {})

// Update conversation/group info
conversationRoutes.put("/:conversationId", () => {})

// Delete Group
conversationRoutes.delete("/:conversationId", () => {})

// Delete conversation history (Only for current user)
conversationRoutes.put("/:conversationId", () => {})

/**
 * Nested routers
 */

// Participants (Members)
conversationRoutes.use("/:conversationId/participants", participantRoutes)

// Messages
conversationRoutes.use("/:conversationId/messages", messageRoutes)

export default conversationRoutes
