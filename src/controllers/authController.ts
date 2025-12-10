import bcrypt from "bcrypt"
import { Request, Response } from "express"

import User from "../models/User.ts"

const SignUpController = async (req: Request, res: Response) => {
    try {
        const { username, password, email, displayName } = req.body

        const requiredFields = ["username", "password", "email", "displayName"]
        // Check missing fields
        const missingFields = requiredFields.filter((field) => !req.body[field])
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing ${missingFields.join(", ")}`,
            })
        }

        // Check username or email already exists
        const duplicate = await User.findOne({ $or: [{ username: username }, { email: email }] })

        if (duplicate) {
            const field = duplicate.username === username ? "username" : "email"

            return res.status(409).json({
                message: `${field} already exists`,
            })
        }
        // Encrypt password
        const hashPassword = await bcrypt.hash(password, 10) // salt = 10 (encrypt password 2^10 times)

        // Create new User
        await User.create({
            username,
            hashPassword,
            email,
            displayName,
        })

        // Return
        return res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        console.error("Error when call SignUpController: ", error)
        return res.status(500).json({ message: "System error" })
    }
}

export { SignUpController }
