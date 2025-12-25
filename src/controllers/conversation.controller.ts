import { HttpStatusCode } from "#/configs/constants/httpStatusCode"
import { ConversationService } from "#/services/conversation.service"
import AppError from "#/utils/AppError"

import { Request, Response } from "express"

export class ConversationController {
    constructor(private readonly service: ConversationService) {}

    // List of recent conversations
    getConversations = async (req: Request, res: Response) => {
        const userId = req.user._id.toString()

        // Validate
        if (!userId) throw new AppError(HttpStatusCode.BAD_REQUEST, "Missing userId")

        const conversations = await this.service.getConversations(userId)

        const formatted = conversations.map((conversation) => {
            const participants = (conversation.participants || []).map((p) => ({
                _id: p.userId?._id,
                displayName: p.userId?.displayName,
                avatarUrl: p.user?.avatar?.url ?? null,
                joinedAt: p.joinedAt,
            }))

            return {
                ...conversation.toObject(),
                unreadCount: conversation.unreadCount || {},
                participants,
            }
        })

        return res.status(HttpStatusCode.OK).json({ conversations: formatted })
    }

    // Group/Conversation info
    getConversationInfo = async (req: Request, res: Response) => {}

    // Create new conversation (Only for group conversation)
    createNewGroup = async (req: Request, res: Response) => {
        const userId = req.user._id.toString()
        const { name, description, memberIds } = req.body

        // Validate
        if (!name || !memberIds || !Array.isArray(memberIds)) {
            throw new AppError(HttpStatusCode.BAD_REQUEST, "Both 'name' & 'memberIds' is required")
        }

        // group members = current user (1) + members
        if (memberIds.length < 2)
            throw new AppError(HttpStatusCode.BAD_REQUEST, "Group members must greater than 2")

        // Create conversation
        const conversation = await this.service.createConversation({
            userId,
            type: "GROUP",
            memberIds,
            name,
            description,
        })

        return res.status(201).json({ conversation })
    }

    // Update conversation info (Check for group & direct)
    updateConversation = async (req: Request, res: Response) => {}

    // Delete group
    deleteGroup = async (req: Request, res: Response) => {}

    // Delete conversation history (Only for current user)
    deleteConversationHistory = async (req: Request, res: Response) => {}
}
