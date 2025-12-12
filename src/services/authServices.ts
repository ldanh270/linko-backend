import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"

import Session from "../models/Session.ts"
import User from "../models/User.ts"
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "../utils/constants.ts"

type CreateUserParams = {
    username: string
    password: string
    email: string
    displayName: string
}

type LoginUser = {
    username: string
    password: string
}

const createUser = async ({ username, password, email, displayName }: CreateUserParams) => {
    // Check username or email already exists
    const duplicate = await User.findOne({ $or: [{ username: username }, { email: email }] })

    if (duplicate) {
        const field = duplicate.username === username ? "Username" : "Email"

        throw new Error(`${field} already exists`)
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

    if (!user) {
        throw new Error("Wrong username or password")
    }

    // Compare input password with password in DB
    const isCorrect = await bcrypt.compare(password, user.hashPassword)

    if (!isCorrect) {
        throw new Error("Wrong username or password")
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

// Delete refresh token in database
const deleteRefreshToken = async (token: string) => {
    // Delete refresh token in DB
    await Session.deleteOne({ refreshToken: token })
}

export { createUser, verifyUser, deleteRefreshToken }
