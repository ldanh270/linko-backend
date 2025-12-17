import { Request, Response } from "express"

import { REFRESH_TOKEN_TTL } from "../config/constants/authTokens"
import {
    createUser,
    deleteRefreshToken,
    getNewAccessToken,
    verifyUser,
} from "../services/auth.service"

const signup = async (req: Request, res: Response) => {
    const { username, password, email, displayName } = req.body

    await createUser({ username, password, email, displayName })
    // Return
    return res.status(201).json({ message: "User created successfully" })
}

const login = async (req: Request, res: Response) => {
    // Get input
    const { username, password } = req.body

    const tokens = await verifyUser({ username, password })

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

const logout = async (req: Request, res: Response) => {
    // Get refresh token in cookie
    const refreshToken = req.cookies?.refreshToken

    // Delete refresh token
    if (refreshToken) {
        deleteRefreshToken(refreshToken)
    }

    // Delete cookie
    res.clearCookie("refreshtoken")

    return res.status(204)
}

const refreshToken = async (req: Request, res: Response) => {
    // Get refresh token from cookie
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
        return res.status(401).json({ message: "Token not exists" })
    }
    const accessToken = await getNewAccessToken(refreshToken)

    return res.status(200).json({ accessToken })
}

export { signup, login, logout, refreshToken }
