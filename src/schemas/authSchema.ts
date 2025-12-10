import zod from "zod"

import { REGEX } from "../utils/constants.ts"

const signupSchema = zod.object({
    body: zod.object({
        username: zod
            .string()
            .min(3, "Username must at least 3 characters")
            .max(20)
            .trim()
            .toLowerCase()
            .regex(
                REGEX.USERNAME,
                "Usernames can only contain lowercase letters, numbers, and underscores",
            ),

        displayName: zod.string().min(1, "Display name cannot empty"),

        email: zod.email("Invalid email").trim(),

        password: zod
            .string()
            .regex(
                REGEX.PASSWORD,
                "Password must have minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character.",
            ),
    }),
})

export { signupSchema }
