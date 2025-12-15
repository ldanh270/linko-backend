import mongoose, { InferSchemaType } from "mongoose"

const lastMessageSchema = new mongoose.Schema(
    {
        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            default: null,
        },
        createdAt: {
            type: Date,
            default: null,
        },
    },
    {
        _id: false,
    },
)

const participantSchema = new mongoose.Schema(
    {
        // User informations
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        nickname: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ["OWNER", "ADMIN", "MEMBER"],
            required: true,
        },

        // User settings
        isArchived: {
            type: Boolean,
            default: false,
        },
        mutedUntil: {
            type: Date,
            default: null,
        },
        clearedHistoryAt: {
            type: Date,
            default: Date.now,
        },

        joinAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        _id: false,
    },
)

// Group info: Only for group conversation
const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        description: {
            type: String,
            trim: true,
        },

        avatar: {
            // Link CDN to display
            url: {
                type: String,
            },

            // Cloundinary public id to delete avatar
            id: {
                type: String,
            },
        },
    },
    {
        _id: false,
    },
)

const conversationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["direct", "group"],
            require: true,
        },

        participant: {
            type: participantSchema,
            required: true,
        },

        group: {
            type: groupSchema,
        },

        lastMessage: {
            type: lastMessageSchema,
            default: null,
        },

        // List of { participantId: unreadMessageNumber }
        unreadCount: {
            type: Map,
            of: Number,
            default: {},
        },
    },

    {
        // Auto create createdAt & updatedAt
        timestamps: true,
    },
)

conversationSchema.index({ "participant.userId": 1, "lastMessage.createdAt": -1 })

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation

export type ConversationType = InferSchemaType<typeof conversationSchema>
