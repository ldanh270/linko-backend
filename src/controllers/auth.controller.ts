import { Request, Response } from "express"

import { REFRESH_TOKEN_TTL } from "../config/constants/authTokens"
import { AuthService } from "../services/auth.service"

export class AuthController {
    constructor(private readonly service: AuthService) {}
    signup = async (req: Request, res: Response) => {
        const { username, password, email, displayName } = req.body

        // Create new user in database
        await this.service.signup({ username, password, email, displayName })

        return res.status(201).json({ message: "User created successfully" })
    }

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body

        // Verify logged in user
        const tokens = await this.service.login({ username, password })

        // Response refresh token (in cookie)
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", // For stateless front-end & back-end
            maxAge: REFRESH_TOKEN_TTL,
        })

        // Response access token (in res.body)
        return res.status(200).json({
            message: `Login successfully`,
            accessToken: tokens.accessToken,
        })
    }

    logout = async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken

        // Delete refresh token
        if (refreshToken) {
            this.service.logout(refreshToken)
        }

        // Delete cookie
        res.clearCookie("refreshtoken")

        return res.status(204)
    }

    getNewToken = async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken

        // Validate
        if (!refreshToken) {
            return res.status(401).json({ message: "Token not exists" })
        }

        // Get new Access token
        const accessToken = await this.service.getNewToken(refreshToken)

        return res.status(200).json({ accessToken })
    }
}
