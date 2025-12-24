import User from "#/models/User"

type KeywordsType = {
    keywords: string
    type: "TYPING" | "FULL"
}

export class UserService {
    searchUserByKeywords = async ({ keywords, type }: KeywordsType) => {
        const TYPING_LIMIT = 5
        const FULL_LIMIT = 50

        /**
         *  Limit by type
         */
        const limit = type === "TYPING" ? TYPING_LIMIT : FULL_LIMIT

        /**
         * $regex allow keywords approximately
         * $options to allow case-insensitive
         */
        const users = await User.find({
            username: { $regex: keywords, $options: "i" },
            fullName: { $regex: keywords, $options: "i" },
        })
            .select("_id username fullName avatar.url")
            .limit(limit)

        return users
    }
}
