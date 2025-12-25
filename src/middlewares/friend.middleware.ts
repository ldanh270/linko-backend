import { HttpStatusCode } from "#/configs/constants/httpStatusCode"
import Friendship from "#/models/Friendship"
import AppError from "#/utils/AppError"

import { NextFunction, Request, Response } from "express"

const swap = (a: string, b: string) => (a < b ? [a, b] : [b, a])

// Only friends can send direct messages together
export const checkFriendship = async (req: Request, res: Response, next: NextFunction) => {
    const me = req.user._id.toString()

    const recipientId = req.body?.recipientId ?? null

    if (!recipientId) throw new AppError(HttpStatusCode.BAD_REQUEST, "'recipientId' is required")

    if (recipientId) {
        const [userA, userB] = swap(me, recipientId)

        const isFriend = await Friendship.findOne({ userA, userB })

        if (!isFriend)
            throw new AppError(HttpStatusCode.FORBIDDEN, "You are not friends with this user yet")

        return next()
    }
}
