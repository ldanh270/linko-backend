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
}
