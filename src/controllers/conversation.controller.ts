import { HttpStatusCode } from "#/config/constants/httpStatusCode"
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

        await this.service.getConversations(userId)
    }

    // Group/Conversation info
    getConversationInfo = async (req: Request, res: Response) => {}

    // Create new conversation (Only for group conversation)
    createNewGroup = async (req: Request, res: Response) => {
        const userId = req.user._id.toString()
        const { name, description, memberIds } = req.body

        // Validate
        if (!name || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            throw new AppError(HttpStatusCode.BAD_REQUEST, "Both 'name' & 'memberIds' is required")
        }

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
