import express from "express"

import messageRouters from "./conversationRoutes/messageRouters"
import participantRouters from "./conversationRoutes/participantRouters"

const conversationRouters = express.Router()

/**
 * Conversation/Group
 */
// List of recent conversations
conversationRouters.get("/", () => {})

// Group/Conversation info
conversationRouters.get("/:conversationId/info", () => {})

// Create new conversation
conversationRouters.post("/", () => {})

// Update conversation/group info
conversationRouters.put("/:conversationId", () => {})

// Delete Group
conversationRouters.delete("/:conversationId", () => {})

// Delete conversation history (Only for current user)
conversationRouters.put("/:conversationId", () => {})

/**
 * Nested routers
 */

// Participants (Members)
conversationRouters.use("/:conversationId/participants", participantRouters)

// Messages
conversationRouters.use("/:conversationId/messages", messageRouters)

export default conversationRouters
