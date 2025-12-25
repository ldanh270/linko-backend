import User from "#/models/User"

type KeywordsType = {
    keyword: string
    type: "TYPING" | "FULL"
}

export class UserService {
    searchUserByKeywords = async ({ keyword, type }: KeywordsType) => {
        const TYPING_LIMIT = 5
        const FULL_LIMIT = 50

        /**
         *  Limit by type
         */
        const limit = type === "TYPING" ? TYPING_LIMIT : FULL_LIMIT

        /**
         * $regex allow keyword approximately
         * $options to allow case-insensitive
         */
        const users = await User.find({
            $or: [
                { username: { $regex: keyword, $options: "i" } },
                { fullName: { $regex: keyword, $options: "i" } },
            ],
        })
            .select("_id username fullName avatar.url")
            .limit(limit)

        return users
    }

    getUserInfo = async (userId: string) => {
        const user = await User.findById({ _id: userId })

        return user
    }
}
