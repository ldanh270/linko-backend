import { Request, Response } from "express"

import { REFRESH_TOKEN_TTL } from "../config/constants/authTokens"
import {
    createUser,
    deleteRefreshToken,
    getNewAccessToken,
    verifyUser,
} from "../services/auth.service"

const signup = async (req: Request, res: Response) => {
    try {
        const { username, password, email, displayName } = req.body

        try {
            await createUser({ username, password, email, displayName })
            // Return
            return res.status(201).json({ message: "User created successfully" })
        } catch (error) {
            console.error("Create user error: ", (error as Error).message)
            return res.status(409).json({ message: (error as Error).message })
        }
    } catch (error) {
        console.error("Error when call signup: ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const login = async (req: Request, res: Response) => {
    try {
        // Get input
        const { username, password } = req.body

        try {
            const tokens = await verifyUser({ username, password })

            // Response refresh token (in cookie)
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none", // For stateless front-end & back-end
                maxAge: REFRESH_TOKEN_TTL,
            })

            // Response access token (in res.body)
            res.status(200).json({
                message: `Login successfully`,
                accessToken: tokens.accessToken,
            })
        } catch (error) {
            console.error("Validate user error: ", (error as Error).message)
            return res.status(409).json({ message: (error as Error).message })
        }
    } catch (error) {
        console.error("Error when call login ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        // Get refresh token in cookie
        const refreshToken = req.cookies?.refreshToken

        // Delete refresh token
        if (refreshToken) {
            deleteRefreshToken(refreshToken)
        }

        // Delete cookie
        res.clearCookie("refreshtoken")

        return res.status(204)
    } catch (error) {
        console.error("Error when call logout ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const refreshToken = async (req: Request, res: Response) => {
    // Get refresh token from cookie
    let accessToken = ""
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
        return res.status(401).json({ message: "Token not exists" })
    }
    try {
        const accessToken = await getNewAccessToken(refreshToken)
    } catch (error) {
        console.error("Validate user error: ", (error as Error).message)
        return res.status(409).json({ message: (error as Error).message })
    }

    return res.status(200).json({ accessToken })
}

export { signup, login, logout, refreshToken }
