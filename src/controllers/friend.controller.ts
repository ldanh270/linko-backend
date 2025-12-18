import { Request, Response } from "express"

import {
    createFriendRequest,
    createFriendship,
    deleteFriendRequest,
    deleteFriendship,
    getFriendList,
    getFriendRequestList,
} from "../services/friend.service"

// Get data
const getAllFriends = async (req: Request, res: Response) => {
    const userId = req.user._id

    // Validate
    if (!userId) return res.status(400).json({ message: "Missing user data" })

    // Get friend list of current user
    const list = await getFriendList(userId)

    return res.status(200).json({ list })
}

const getSentRequests = async (req: Request, res: Response) => {
    const userId = req.user._id

    // Validate
    if (!userId) return res.status(400).json({ message: "Missing user data" })

    // Get requests current user sent
    const list = await getFriendRequestList(userId, "SENT")

    return res.status(200).json({ list })
}

const getRecievedRequests = async (req: Request, res: Response) => {
    const userId = req.user._id

    // Validate
    if (!userId) return res.status(400).json({ message: "Missing user data" })

    // Get requests current user sent
    const list = await getFriendRequestList(userId, "RECEIVED")
    return res.status(200).json({ list })
}

// Send request
const sendRequest = async (req: Request, res: Response) => {
    const from = req.user._id
    const { to, message } = req.body

    // Validate
    if (!from) return res.status(401).json({ message: "Unauthorized" })
    if (!to) return res.status(400).json({ message: "Missing sendTo" })

    if (from === to)
        return res.status(400).json({ message: "Sender and receiver cannot be the same" })

    // Create friend request in database
    const request = await createFriendRequest(from, to, message)

    return res.status(201).json({ message: "Sent friend request successfully", request })
}

const unfriend = async (req: Request, res: Response) => {
    const userId = req.user._id
    const { friendId } = req.params

    // Validate
    if (!userId) return res.status(400).json({ message: "Missing user data" })
    if (!friendId) return res.status(400).json({ message: "Missing friend id" })

    await deleteFriendship(userId.toString(), friendId)

    return res.status(204)
}

// Modify request
const acceptRequest = async (req: Request, res: Response) => {
    const userId = req.user._id
    const { requestId } = req.params

    // Validate
    if (!userId) return res.status(400).json({ message: "Missing user data" })
    if (!requestId) return res.status(400).json({ message: "Missing friend request id" })

    // Create friendship & Delete friend request
    await createFriendship(requestId, userId)

    return res.status(200).json({ message: "Accept friend request successfully" })
}

const declineRequest = async (req: Request, res: Response) => {
    const userId = req.user._id
    const { requestId } = req.params

    // Validate
    if (!userId) return res.status(400).json({ message: "Missing user data" })
    if (!requestId) return res.status(400).json({ message: "Missing friend request id" })

    // Delete friend request
    await deleteFriendRequest(requestId, userId)

    return res.status(200).json({ message: "Deny friend request successfully" })
}

export {
    getAllFriends,
    unfriend,
    getSentRequests,
    sendRequest,
    getRecievedRequests,
    acceptRequest,
    declineRequest,
}
