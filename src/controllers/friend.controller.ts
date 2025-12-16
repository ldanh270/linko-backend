import { Request, Response } from "express"

// Get data
const getAllFriends = async (req: Request, res: Response) => {
    try {
    } catch (error) {
        console.error("getAllFriends error: ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const getSentRequests = async (req: Request, res: Response) => {
    try {
    } catch (error) {
        console.error("getSentRequests error: ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const getRecievedRequests = async (req: Request, res: Response) => {
    try {
    } catch (error) {
        console.error("getRecievedRequests error: ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

// Send/Decline request
const sendRequest = async (req: Request, res: Response) => {
    try {
    } catch (error) {
        console.error("sendRequest error: ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const unfriend = async (req: Request, res: Response) => {
    try {
    } catch (error) {
        console.error("unfriend error: ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

// Modify request
const acceptRequest = async (req: Request, res: Response) => {
    try {
    } catch (error) {
        console.error("acceptRequest error: ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

const declineRequest = async (req: Request, res: Response) => {
    try {
    } catch (error) {
        console.error("declineRequest error: ", (error as Error).message)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export {
    getAllFriends,
    unfriend,
    getSentRequests,
    sendRequest,
    getRecievedRequests,
    acceptRequest,
    declineRequest,
}
