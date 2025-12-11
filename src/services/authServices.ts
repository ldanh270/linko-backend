import bcrypt from "bcrypt"

import User from "../models/User.ts"

type CreateUserParams = {
    username: string
    password: string
    email: string
    displayName: string
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

export { createUser }
