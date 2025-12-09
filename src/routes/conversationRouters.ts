import express from "express"

const conversationRouters = express.Router()

/**
 * Conversation/Group
 */
// List of recent conversations
conversationRouters.get("/", () => {})

// Group/Conversation info
conversationRouters.get("/:id/info", () => {})

// Create new conversation
conversationRouters.post("/", () => {})

// Update conversation/group info
conversationRouters.put("/:id", () => {})

// Delete Group
conversationRouters.delete("/:id", () => {})

// Delete conversation history (Only for current user)
conversationRouters.put("/:id", () => {})

/**
 * Members
 */

// List of members in specific conversation
conversationRouters.get("/:id/participants", () => {})

// Add members into group
conversationRouters.put("/:id/participants", () => {})

// Edit members in group
conversationRouters.put("/:id/participants", () => {})

// Delete members from group
conversationRouters.put("/:id/participants", () => {})

/**
 * Messages
 */

// List of newest messages in specific conversation
conversationRouters.get("/:id", () => {})

// Send new message to conversation
conversationRouters.put("/:id/messsages", () => {})

// Edit a specific message in conversation
conversationRouters.put("/:id/messsages/:id", () => {})

// Delete a specific message in conversation
conversationRouters.put("/:id/messsages/:id", () => {})

export default conversationRouters
