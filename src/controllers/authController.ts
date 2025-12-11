import { Request, Response } from "express"

import { createUser } from "../services/authServices.ts"

const SignUp = async (req: Request, res: Response) => {
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
        console.error("Error when call SignUp: ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export { SignUp }
