import { HttpStatusCode } from "#/config/constants/httpStatusCode"
import { ConversationService } from "#/services/conversation.service"
import { MessageService } from "#/services/message.service"
import AppError from "#/utils/AppError"
import { updateConversationAfterCreateMessage } from "#/utils/messageHelper"

import { Request, Response } from "express"

export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly conversationService: ConversationService,
    ) {}

    sendMessage = async (req: Request, res: Response) => {
        const senderId = req.user._id.toString()
        const { conversationId, recipientId, content, replyTo, mentions, attachments } = req.body

        /**
         * VALIDATE
         */

        // Message must have conversationId (for exists conversation) or recipientId (for the first direct message)
        if (!conversationId && !recipientId)
            throw new AppError(
                HttpStatusCode.BAD_REQUEST,
                "Either 'conversationId' or 'recipientId' is required",
            )

        // Required only conversationId (for exists conversation) or recipientId (for new direct conversation), NOT BOTH
        if (conversationId && recipientId)
            throw new AppError(
                HttpStatusCode.BAD_REQUEST,
                "Only one of 'conversationId' or 'recipientId' can be provided, not both.",
            )

        // Message must have either content or attachments
        if (!content?.trim() && !attachments)
            throw new AppError(
                HttpStatusCode.BAD_REQUEST,
                "Either 'content' or 'attachments' is required",
            )

        // Recipient must different with sender
        if (senderId === recipientId)
            throw new AppError(
                HttpStatusCode.BAD_REQUEST,
                "Sender and recipient can not be the same",
            )

        /**
         * CREATE CONVERSATION
         */

        // Create new conversation & add message if not created
        let conversation = null

        if (conversationId) {
            // If having conversationId
            conversation = await this.conversationService.findConversationById(conversationId)

            if (!conversation)
                throw new AppError(HttpStatusCode.NOT_FOUND, "Conversation not found")

            // Check user is conversation participants
            if (!(await this.conversationService.isUserInConversation(conversationId, senderId))) {
                throw new AppError(HttpStatusCode.FORBIDDEN, "User not in conversation")
            }
        } else {
            // If having recipientId
            conversation = await this.conversationService.findConversationByParticipants(
                senderId,
                recipientId,
            )
        }

        if (!conversation) {
            // Check users are friends
            if (!(await this.conversationService.isUsersBeFriends(senderId, recipientId)))
                throw new AppError(HttpStatusCode.FORBIDDEN, "Users are not be friends")

            // Create new conversation & new message
            const [conversation, message] =
                await this.conversationService.createNewConversationWithMessage({
                    senderId,
                    recipientId,
                    content,
                })

            return res.status(HttpStatusCode.CREATED).json({ conversation, message })
        }

        /**
         * CREATE MESSAGE
         */

        // Send message to conversation if exists conversation
        const message = await this.messageService.sendMessageToConversation({
            conversationId: conversation._id,
            senderId,
            content,
            attachments,
            replyTo,
            mentions,
        })

        // Update conversation data after send message
        updateConversationAfterCreateMessage(conversation, message, senderId)

        await conversation.save()

        return res.status(HttpStatusCode.CREATED).json({ conversation, message })
    }
}
