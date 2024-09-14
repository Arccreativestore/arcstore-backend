import { ObjectId } from "mongoose";
import { tokenModel } from "../../models/token";
import { tokenModelRes } from "./types";



export class tokenDataSource {
    
    async findToken(tokenId: string): Promise<tokenModelRes | null>{
       const find = await tokenModel().findOne({tokenId})
       return find ? find.toObject() : null
    }

    async newToken(tokenId: string, user_id: ObjectId, expiresAt: number){

        await tokenModel().create({tokenId, user_id, expiresAt})
    }

    async deleteAllTokens(_id: ObjectId){
        await tokenModel().deleteMany({user_id: _id})
    }

    async updateTokenStatus(tokenId: string){
        await tokenModel().findOneAndUpdate({tokenId}, {used: true}, {new: true})
    }
}