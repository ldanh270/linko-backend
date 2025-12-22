import { NextFunction, Request, Response } from "express"

// Format errors for Developer: Detailed stack trace to fix bug
const sendErrorDev = (err: any, res: Response) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

// Format errors for Client(Production): Thin, clean to hide logic
const sendErrorClient = (err: any, res: Response) => {
    // Handled errors (Operational) => Send detailed message
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }
    // Strange errors (Programming/Bug) => Hide for client
    else {
        console.error("ERROR:", err)

        res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        })
    }
}

// GLOBAL ERROR HANDLER MIDDLEWARE
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Default if no status code input
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res)
    } else {
        sendErrorClient(err, res)
    }
}
