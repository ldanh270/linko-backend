import express from "express"

import {
    acceptRequest,
    declineRequest,
    getAllFriends,
    getRecievedRequests,
    getSentRequests,
    sendRequest,
    unfriend,
} from "../controllers/friend.controller"

const friendRoutes = express.Router()

// List friends of current user
friendRoutes.get("/", getAllFriends)

// List request that current user sent
friendRoutes.get("/sent", getSentRequests)

// List request that current user received
friendRoutes.get("/received", getRecievedRequests)

// Send friend request for specific user
friendRoutes.post("/sent", sendRequest)

// Unfriend
friendRoutes.delete("/:friendId", unfriend)

// Accept request
friendRoutes.post(":requestId/accept", acceptRequest)

// Decline request
friendRoutes.post(":requestId/accept", declineRequest)

export default friendRoutes
