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

        // Message must have conversationId (For exists conversation) or recipientId (For the first direct message)
        if (!conversationId && !recipientId)
            throw new AppError(
                HttpStatusCode.BAD_REQUEST,
                "Either 'conversationId' or 'recipientId' is required",
            )

        // Message must have either content or attachments
        if (!content && !attachments)
            throw new AppError(
                HttpStatusCode.BAD_REQUEST,
                "Either 'content' or 'attachments' is required",
            )

        // Create both conversation & message if not created
        let conversation = await this.conversationService.isConversationExisting(conversationId)

        if (!conversation) {
            // Create new conversation & new message
            const [conversation, message] =
                await this.conversationService.createNewConversationWithMessage({
                    senderId,
                    recipientId,
                    content,
                })

            return res.status(HttpStatusCode.CREATED).json({ conversation, message })
        }

        // Send message to exists conversation
        const message = await this.messageService.sendMessageToConversation({
            conversationId,
            senderId,
            content,
            attachments,
        })

        // Update conversation data after send message
        updateConversationAfterCreateMessage(conversation, message, senderId)

        await conversation.save()

        return res.status(HttpStatusCode.CREATED).json({ conversation, message })
    }
}
