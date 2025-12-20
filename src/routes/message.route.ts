import { MessageController } from "#/controllers/message.controller"
import { ConversationService } from "#/services/conversation.service"
import { MessageService } from "#/services/message.service"

import express from "express"

const messageRoutes = express.Router()

const messageService = new MessageService()

const conversationService = new ConversationService(messageService)

const controller = new MessageController(messageService, conversationService)

// List of newest messages in specific conversation
messageRoutes.get("/:conversationId", () => {})

// Send new message to conversation
messageRoutes.post("/", controller.sendMessage)

// Edit a specific message in conversation
messageRoutes.put("/:messageId", () => {})

// Delete a specific message in conversation
messageRoutes.delete("/:messageId", () => {})

export default messageRoutes
