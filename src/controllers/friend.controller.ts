import { Request, Response } from "express"

import { FriendService } from "../services/friend.service"

export class FriendController {
    constructor(private readonly service: FriendService) {}

    // Get data
    getAllFriends = async (req: Request, res: Response) => {
        const userId = req.user._id

        // Validate
        if (!userId) return res.status(400).json({ message: "Missing user data" })

        // Get friend list of current user
        const list = await this.service.getAllFriends(userId)

        return res.status(200).json({ list })
    }

    getSentRequests = async (req: Request, res: Response) => {
        const userId = req.user._id

        // Validate
        if (!userId) return res.status(400).json({ message: "Missing user data" })

        // Get requests current user sent
        const list = await this.service.getAllFriendRequests(userId, "SENT")

        return res.status(200).json({ list })
    }

    getRecievedRequests = async (req: Request, res: Response) => {
        const userId = req.user._id

        // Validate
        if (!userId) return res.status(400).json({ message: "Missing user data" })

        // Get requests current user sent
        const list = await this.service.getAllFriendRequests(userId, "RECEIVED")

        return res.status(200).json({ list })
    }

    // Send request
    sendFriendRequest = async (req: Request, res: Response) => {
        const from = req.user._id
        const { to, message } = req.body

        // Validate
        if (!from) return res.status(401).json({ message: "Unauthorized" })
        if (!to) return res.status(400).json({ message: "Missing sendTo" })

        if (from === to)
            return res.status(400).json({ message: "Sender and receiver cannot be the same" })

        // Create friend request in database
        const request = await this.service.sendFriendRequest(from, to, message)

        return res.status(201).json({ message: "Sent friend request successfully", request })
    }

    unfriend = async (req: Request, res: Response) => {
        const userId = req.user._id
        const { friendId } = req.params

        // Validate
        if (!userId) return res.status(400).json({ message: "Missing user data" })
        if (!friendId) return res.status(400).json({ message: "Missing friend id" })

        await this.service.unfriend(userId.toString(), friendId)

        return res.status(204)
    }

    // Modify request
    acceptRequest = async (req: Request, res: Response) => {
        const userId = req.user._id
        const { requestId } = req.params

        // Validate
        if (!userId) return res.status(400).json({ message: "Missing user data" })
        if (!requestId) return res.status(400).json({ message: "Missing friend request id" })

        // Create friendship & Delete friend request
        const friendship = await this.service.acceptRequest(requestId, userId)

        return res.status(201).json({ message: "Accept friend request successfully", friendship })
    }

    declineRequest = async (req: Request, res: Response) => {
        const userId = req.user._id
        const { requestId } = req.params

        // Validate
        if (!userId) return res.status(400).json({ message: "Missing user data" })
        if (!requestId) return res.status(400).json({ message: "Missing friend request id" })

        // Delete friend request
        await this.service.declineRequest(requestId, userId)

        return res.status(204)
    }
}
