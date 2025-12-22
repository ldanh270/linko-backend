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
    replyTo?: string
    mentions?: string[]
}

export class MessageService {
    sendMessageToConversation = async ({
        conversationId,
        senderId,
        content,
        attachments,
        replyTo = null,
        mentions = [],
    }: MessageType) => {
        const message = await Message.create({
            conversationId: conversationId,
            senderId: new mongoose.Types.ObjectId(senderId),
            content,
            attachments,
            replyTo: new mongoose.Types.ObjectId(replyTo),
            mentions: mentions ? mentions.map((id) => new mongoose.Types.ObjectId(id)) : [],
        })

        return message
    }
}
