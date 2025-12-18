import { QueryFilter, Types } from "mongoose"

import { HttpStatusCode } from "../config/constants/httpStatusCode"
import FriendRequest, { FriendRequestType } from "../models/FriendRequest"
import Friendship from "../models/Friendship"
import User from "../models/User"
import AppError from "../utils/AppError"

const getFriendList = async (userId: Types.ObjectId) => {
    // Find user's friendships in database
    const friendShips = await Friendship.find({
        $or: [{ userA: userId }, { userB: userId }],
    })
        .populate("userA", "_id displayName avatar.url")
        .populate("userB", "_id displayName avatar.url")
        .lean()

    // User have no friend
    if (friendShips.length === 0) return []

    // Get friend list of userId
    const friends = friendShips.map((fs) =>
        fs.userA._id.toString() === userId.toString() ? fs.userB : fs.userA,
    )

    return friends
}

const createFriendRequest = async (from: Types.ObjectId, to: Types.ObjectId, message?: string) => {
    // Check is toUser exists
    const user = await User.exists({ _id: to })
    if (!user) throw new AppError(404, "User not exists")

    // Swap by _id to check friendship existing
    let userA = from.toString()
    let userB = to.toString()

    if (userA > userB) [userA, userB] = [userB, userA] // Swap userA & userB if userA > userB

    // Get already friend or existing request status
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

    // Already be friends
    if (alreadyFriend) throw new AppError(HttpStatusCode.CONFLICT, "Users are already friends")

    // Already sent request
    if (existingRequest)
        throw new AppError(HttpStatusCode.CONFLICT, "Friend request already pending")

    // Create friend request in database
    FriendRequest.create({ from, to, message })
}

const createFriendship = async (requestId: string, userId: Types.ObjectId) => {
    const friendRequest = await FriendRequest.findOne({ _id: requestId })

    // Validate
    if (!friendRequest) throw new AppError(HttpStatusCode.NOT_FOUND, "Friend request not exists")

    // Only received user can be accept request
    if (userId.toString() !== friendRequest.to.toString())
        throw new AppError(HttpStatusCode.FORBIDDEN, "Only invited user can be accept request")

    // Create friendship
    await Friendship.create({ userA: userId, userB: friendRequest.from })

    // Delete request
    await FriendRequest.findByIdAndDelete(requestId)
}

const deleteFriendRequest = async (requestId: string, userId: Types.ObjectId) => {
    const friendRequest = await FriendRequest.findOne({ _id: requestId })

    // Validate
    if (!friendRequest) throw new AppError(HttpStatusCode.NOT_FOUND, "Friend request not exists")

    // Only received user can be deny request
    if (userId.toString() !== friendRequest.to.toString())
        throw new AppError(HttpStatusCode.UNAUTHORIZED, "Only invited user can be decline request")

    // Delete request
    await FriendRequest.findByIdAndDelete(requestId)
}

const getFriendRequestList = async (userId: Types.ObjectId, type: "SENT" | "RECEIVED" | "BOTH") => {
    let filter: QueryFilter<FriendRequestType> = {}

    if (type === "SENT") {
        // SENT: Only Sent requests (from: userId)
        filter = { from: userId }
    } else if (type === "RECEIVED") {
        // RECEIVED: Only Received requests (to: UserId)
        filter = { to: userId }
    } else {
        // BOTH: Both Sent & Received
        filter = {
            $or: [{ from: userId }, { to: userId }],
        }
    }

    // Friend request list result
    const list = await FriendRequest.find(filter).sort({ createdAt: -1 })

    return list
}

export {
    createFriendRequest,
    createFriendship,
    deleteFriendRequest,
    getFriendList,
    getFriendRequestList,
}
