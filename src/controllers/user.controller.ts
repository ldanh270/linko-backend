import { HttpStatusCode } from "#/configs/constants/httpStatusCode"
import User from "#/models/User"
import { UserService } from "#/services/user.service"
import AppError from "#/utils/AppError"
import { checkUniqueFields } from "#/utils/user.util"

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
            const user = req.user

            /**
             * Get file from upload middleware
             * @fieldname key string (e.g. avatar, background, ...)
             */
            const files = req.files as { [fieldname: string]: Express.Multer.File[] }

            /**
             * VALIDATE
             */
            // TODO: Create check field helper for duplicate unique fields

            // Check authorization
            if (!user._id)
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" })

            // Check username

            const checkUsername = checkUniqueFields({ key: "username", value: user.username })

            if (!checkUsername)
                return res.status(HttpStatusCode.CONFLICT).json({ message: "Existing username" })

            // Check email
            const checkEmail = checkUniqueFields({ key: "email", value: user.email })

            if (!checkEmail)
                return res.status(HttpStatusCode.CONFLICT).json({ message: "Existing email" })

            // Check phone
            const checkPhone = checkUniqueFields({ key: "phone", value: user.phone })

            if (!checkPhone)
                return res
                    .status(HttpStatusCode.CONFLICT)
                    .json({ message: "Existing phone number" })

            /**
             * LOGIC
             */

            // Update user info
            const updatedUser = await this.service.updateUserInfo({
                userId: user._id.toString(),
                updateData: req.body, // Contains text fields & string/null
                files: files,
            })

            // Update successfully
            res.status(200).json({
                user: updatedUser,
            })
        } catch (error) {
            console.log(error)
        }
    }
}
