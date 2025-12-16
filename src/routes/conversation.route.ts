import express from "express"

import messageRoutes from "./conversationRoutes/message.route.ts"
import participantRoutes from "./conversationRoutes/participant.route.ts"

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
conversationRoutes.delete("/:conversationId/history", () => {})

/**
 * Nested routers
 */

// Participants (Members)
conversationRoutes.use("/:conversationId/participants", participantRoutes)

// Messages
conversationRoutes.use("/:conversationId/messages", messageRoutes)

export default conversationRoutes
