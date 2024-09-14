import { ObjectId } from "mongoose";


export interface tokenModelRes {

    readonly _id: ObjectId
    tokenId: string
    user_id: ObjectId
    used: boolean
    expiresAt: number
}