import { ObjectId, Types } from "mongoose";
import _2faModel from "../../models/_2fa";
import { userModel } from "../../models/user";


class _2faDatasource {

   async saveOtp(otp: number, userId: ObjectId){
        if(!otp || !userId) return
        const create = await _2faModel().create({
            userId,
            otp,
            expiresAt: new Date(Date.now() + 1800000)
        })
        return create ? true : false
    }

    async compareOtp(otp: number, userId: ObjectId){
        const find = await _2faModel().findOne({otp, userId}).sort({createdAt: -1})
        return find ? find.toObject() : null
    }

    async deleteOtp(userId: ObjectId){
        const del = await _2faModel().deleteMany({userId})
        return del.deletedCount > 0 ? true : false
    }

    async enable2fa(userId: ObjectId){
    const update = await userModel().updateOne({_id: userId}, {$set: {_2fa: true}})
    return update.matchedCount > 0 ? true : false
  }
}

export default _2faDatasource