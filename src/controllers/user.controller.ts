import { HttpStatusCode } from "#/configs/constants/httpStatusCode"
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

    // GET /:userId
    getUserByParams = async (req: Request, res: Response) => {
        const { userId } = req.params
        const loginUserId = req.user?._id

        // User not logged-in or missing user data
        if (!loginUserId)
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" })

        // Get params user info
        const user = await this.service.getUserInfo({ userId })

        // User not found
        if (!user) return res.status(HttpStatusCode.NOT_FOUND).json({ message: "User not found" })

        // Return user to client
        return res.status(HttpStatusCode.OK).json({ user })
    }

    // PATCH /
    updateProfile = async (req: Request, res: Response) => {
        try {
            const userId = req.user._id.toString()

            /**
             * Get file from upload middleware
             * @fieldname key string (e.g. avatar, background, ...)
             */
            const files = req.files as { [fieldname: string]: Express.Multer.File[] }

            /**
             * VALIDATE
             */
            // TODO: Create check field helper

            // Check authorization
            if (!userId)
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" })

            // Check username

            // Check email

            // Check phone

            /**
             * LOGIC
             */

            // Update user info
            const updatedUser = await this.service.updateUserInfo({
                userId,
                updateData: req.body, // Contains text fields & string/null
                files: files,
            })

            // Update successfully
            res.status(200).json({
                message: "Cập nhật thông tin thành công",
                data: updatedUser,
            })
        } catch (error) {
            console.log(error)
        }
    }
}
