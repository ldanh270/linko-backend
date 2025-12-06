import "dotenv/config"
import express from "express"

import chatRouters from "./routes/chatRouters.ts"
import userRouter from "./routes/userRouters.ts"

const PORT = process.env.PORT || 5000
const app = express()

app.use("/api/chat", chatRouters)
app.use("/api/user", userRouter)

app.listen(PORT, () => {
    console.log("Server start on port " + PORT)
})
