import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"

import {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL,
} from "../config/constants/authTokens"
import { HttpStatusCode } from "../config/constants/httpStatusCode"
import Session from "../models/Session"
import User from "../models/User"
import AppError from "../utils/AppError"

type SignupUser = {
    username: string
    password: string
    email: string
    displayName: string
}

type LoginUser = {
    username: string
    password: string
}

const createUser = async ({ username, password, email, displayName }: SignupUser) => {
    const duplicate = await User.findOne({ $or: [{ username: username }, { email: email }] })

    // Duplicate username or email
    if (duplicate) {
        const field = duplicate.username === username ? "Username" : "Email"

        throw new AppError(HttpStatusCode.CONFLICT, `${field} already exists`)
    }
    // Encrypt password
    const hashPassword = await bcrypt.hash(password, 10) // salt = 10 (encrypt password 2^10 times)

    // Create new User
    return await User.create({
        username,
        hashPassword,
        email,
        displayName,
    })
}

const verifyUser = async ({ username, password }: LoginUser) => {
    const user = await User.findOne({ username })

    // User not exists
    if (!user) {
        throw new AppError(HttpStatusCode.UNAUTHORIZED, "Wrong username or password")
    }

    // Compare input password with password in DB
    const isCorrect = await bcrypt.compare(password, user.hashPassword)

    // Wrong password
    if (!isCorrect) {
        throw new AppError(HttpStatusCode.UNAUTHORIZED, "Wrong username or password")
    }

    // Create access token
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_TTL,
    })

    // Create refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex")

    // Create new session to save refresh token
    await Session.create({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    })

    // Return accessToken & refresh
    return { accessToken, refreshToken }
}

const deleteRefreshToken = async (token: string) => {
    // Delete refresh token in database
    await Session.deleteOne({ refreshToken: token })
}

const getNewAccessToken = async (token: string) => {
    // Compare with token in database
    const session = await Session.findOne({ refreshToken: token })

    // Session not exists (Invaild token)
    if (!session) {
        throw new AppError(HttpStatusCode.UNAUTHORIZED, "Incorrect or expired token")
    }

    // Expired token
    if (session.expiresAt < new Date()) {
        throw new AppError(HttpStatusCode.UNAUTHORIZED, "Incorrect or expired token")
    }

    // Create new access token
    const accessToken = jwt.sign(
        {
            userId: session.userId,
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_TTL,
        },
    )

    return { accessToken }
}

export { createUser, verifyUser, deleteRefreshToken, getNewAccessToken }
