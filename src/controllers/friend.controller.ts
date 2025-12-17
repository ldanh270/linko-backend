import { Request, Response } from "express"

import {
    createFriendRequest,
    createFriendship,
    deleteFriendRequest,
    getFriendList,
} from "../services/friend.service"

// Get data
const getAllFriends = async (req: Request, res: Response) => {
    const userId = req.user._id

    const list = await getFriendList(userId)
    return res.status(200).json({ list })
}

const getSentRequests = async (req: Request, res: Response) => {}

const getRecievedRequests = async (req: Request, res: Response) => {}

// Send request
const sendRequest = async (req: Request, res: Response) => {
    // Get input data (from, to, message) from req
    const from = req.user._id
    const { to, message } = req.body

    // Validate
    if (!from) return res.status(401).json({ message: "Unauthorized" })
    if (!to) return res.status(400).json({ message: "Missing sendTo" })

    if (from === to)
        return res.status(400).json({ message: "Sender and receiver cannot be the same" })

    await createFriendRequest(from, to, message)
    return res.status(200).json({ message: "Send friend request successfully" })
}

const unfriend = async (req: Request, res: Response) => {}

// Modify request
const acceptRequest = async (req: Request, res: Response) => {
    const userId = req.user._id
    const { requestId } = req.params

    // Validate
    if (!userId) return res.status(401).json({ message: "Unauthorized" })
    if (!requestId) return res.status(400).json({ message: "Missing friend request id" })

    await createFriendship(requestId, userId)
    return res.status(200).json({ message: "Accept friend request successfully" })
}

const declineRequest = async (req: Request, res: Response) => {
    const userId = req.user._id
    const { requestId } = req.params

    // Validate
    if (!userId) return res.status(401).json({ message: "Unauthorized" })
    if (!requestId) return res.status(400).json({ message: "Missing friend request id" })

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
