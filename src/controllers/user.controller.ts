import { HttpStatusCode } from "#/config/constants/httpStatusCode"
import { UserService } from "#/services/user.service"
import AppError from "#/utils/AppError"

import { Request, Response } from "express"

export class UserController {
    constructor(private readonly service: UserService) {}

    // GET /me
    getUserProfile = async (req: Request, res: Response) => {
        const user = req.user

        if (!user) throw new AppError(HttpStatusCode.UNAUTHORIZED, "Missing user data")

        return res.status(HttpStatusCode.OK).json({ user })
    }

    // GET /search
    searchUsers = async (req: Request, res: Response) => {
        const { type } = req.body
        const { keyword } = req.query

        if (!keyword) return res.status(HttpStatusCode.NO_CONTENT).json([])

        if (type !== "TYPING" && type !== "FULL")
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Invalid keyword type" })

        const users = await this.service.searchUserByKeywords({
            keyword: keyword as string,
            type,
        })

        return res.status(HttpStatusCode.OK).json({ users })
    }
}
