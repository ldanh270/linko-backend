import { Types } from "mongoose"

import FriendRequest from "../models/FriendRequest"
import Friendship from "../models/Friendship"
import User from "../models/User"

const createFriendRequest = async (from: Types.ObjectId, to: Types.ObjectId) => {
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
}

export { createFriendRequest }
