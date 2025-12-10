import express from "express"

const participantRouters = express.Router({ mergeParams: true })

// List of members in specific conversation
participantRouters.get("/", () => {})

// Add members into group
participantRouters.post("/", () => {})

// Edit members in group
participantRouters.put("/:userId", () => {})

// Delete members from group
participantRouters.delete("/:userId", () => {})

export default participantRouters
