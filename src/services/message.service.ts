import Message from "#/models/Message"

import mongoose, { Types } from "mongoose"

type MessageType = {
    conversationId: Types.ObjectId
    senderId: string
    content?: string
    attachments?: {
        url: string
        id: string
    }[]
}

export class MessageService {
    sendMessageToConversation = async ({
        conversationId,
        senderId,
        content,
        attachments,
    }: MessageType) => {
        const message = await Message.create({
            conversationId: conversationId,
            senderId: new mongoose.Types.ObjectId(senderId),
            content,
            attachments,
        })

        return message
    }
}
