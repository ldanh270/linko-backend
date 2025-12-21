import Conversation from "#/models/Conversation"
import { MessageService } from "#/services/message.service"
import { updateConversationAfterCreateMessage } from "#/utils/messageHelper"

import mongoose from "mongoose"

type InitConversationParamsType = {
    senderId: string
    recipientId: string
    content?: string
    attachments?: {
        url: string
        id: string
    }[]
}

export class ConversationService {
    constructor(private readonly messageService: MessageService) {}

    // Find conversation by id (string)
    findConversationById = async (conversationId?: string) => {
        const conversation = await Conversation.findById(conversationId)

        // Conversation found
        if (!conversation) return null

        // Conversation not found
        return conversation
    }

    // Find conversation by participants id (Only for direct message)
    findConversationByParticipants = async (userId1: string, userId2: string) => {
        const conversation = await Conversation.findOne({
            participants: { $all: [userId1, userId2] },
            type: "direct",
        })

        return conversation
    }

    createNewConversationWithMessage = async ({
        senderId,
        recipientId,
        content,
        attachments,
    }: InitConversationParamsType) => {
        // Create conversation id for reference between conversation & message
        const newConversationId = new mongoose.Types.ObjectId()

        // Create message with initial conversation id
        const message = await this.messageService.sendMessageToConversation({
            conversationId: newConversationId,
            senderId,
            content,
            attachments,
        })

        // Create conversation with created message
        const conversation = await Conversation.create({
            _id: newConversationId,
            conversationType: "DIRECT",
            participants: [
                { userId: new mongoose.Types.ObjectId(senderId), role: "DIRECT" },
                { userId: new mongoose.Types.ObjectId(recipientId), role: "DIRECT" },
            ],
            lastMessage: {
                messageId: message._id,
                senderId: new mongoose.Types.ObjectId(senderId),
                content,
                createdAt: new Date(),
            },
            unreadCount: new Map(),
        })

        return [conversation, message]
    }
}
