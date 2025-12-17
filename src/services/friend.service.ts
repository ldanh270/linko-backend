import { Types } from "mongoose"

import FriendRequest from "../models/FriendRequest"
import Friendship from "../models/Friendship"
import User from "../models/User"

const createFriendRequest = async (from: Types.ObjectId, to: Types.ObjectId, message?: string) => {
    // Check is toUser exists
    const user = await User.exists({ _id: to })
    if (!user) throw new Error("User not exists")

    // Swap by _id to check friendship existing
    let userA = from.toString()
    let userB = to.toString()

    if (userA > userB) [userA, userB] = [userB, userA] // Swap userA & userB

    // Check is already friend or existing request
    const [alreadyFriend, existingRequest] = await Promise.all([
        Friendship.findOne({ userA, userB }),
        FriendRequest.findOne({
            $or: [
                { from, to },
                {
                    from: to,
                    to: from,
                },
            ],
        }),
    ])

    if (alreadyFriend) throw new Error("Users were already friends")
    if (existingRequest) throw new Error("Friend request already pending")

    // Send request
    FriendRequest.create({ from, to, message })
}

const createFriendship = async (requestId: string, userId: Types.ObjectId) => {
    const friendRequest = await FriendRequest.findOne({ _id: requestId })

    // Validate
    if (!friendRequest) throw new Error("Friend request not exists")

    // Only received user can be accept request
    if (userId.toString() !== friendRequest.to.toString()) throw new Error("Unauthorized")

    // Create friendship
    await Friendship.create({ userA: userId, userB: friendRequest.from })

    // Delete request
    await FriendRequest.findByIdAndDelete(requestId)
}

const deleteFriendRequest = async (requestId: string, userId: Types.ObjectId) => {
    const friendRequest = await FriendRequest.findOne({ _id: requestId })

    // Validate
    if (!friendRequest) throw new Error("Friend request not exists")

    // Only received user can be deny request
    if (userId.toString() !== friendRequest.to.toString()) throw new Error("Unauthorized")

    // Delete request
    await FriendRequest.findByIdAndDelete(requestId)
}

export { createFriendRequest, createFriendship, deleteFriendRequest }
