import { NextFunction, Request, Response } from "express"
import { ZodError, ZodObject } from "zod"

const validate = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        })

        next()
    } catch (err) {
        if (err instanceof ZodError) {
            const formattedErrors = err.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            }))

            return res.status(400).json({
                errors: formattedErrors,
            })
        }

        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

export default validate
