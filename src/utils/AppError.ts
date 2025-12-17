class AppError extends Error {
    statusCode: number
    status: string
    isOperational: boolean

    constructor(statusCode: number, message: string) {
        super(message)
        this.statusCode = statusCode

        // 4xx (400, 404) => fail, 5xx => error
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"

        // This is operational error, made by user & handled => Can return error. E.g. wrong email, username, ...
        this.isOperational = true

        // Helps log errors to point specifically to the line of code calling AppError, not this class
        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError
