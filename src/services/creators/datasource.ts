import { defineArguments } from "graphql/type/definition";
import creatorsModel from "../../models/creator";
import { UserDatasource } from "../auth/datasource";
import { userModel } from "../../models/user";
import mongoose, { Schema, Types, ObjectId } from "mongoose";
import { ErrorHandlers } from "../../helpers/errorHandler";



class CreatorDatasource {
    async createProfile(data: any){
        try {
        const {userId} = data
        const create = await creatorsModel().create(data)
        await userModel().updateOne({_id: userId}, {$set: { role: 'CREATOR'}})
        if(create) return create.toObject()
        throw new Error('server error, cannot create profile now')

        } catch (error) {
            throw error
        }
    }

    async creatorExist(_id: string){
        return await creatorsModel().findById(_id)
    }

    async findCreatorByUserId(_id: ObjectId){
        try {
            
        const find = await creatorsModel().findOne({userId: _id})
        if(find) return find.toObject()
        return null

        } catch (error) {
            throw error
        }
    }

    async checkFollowing(userId: ObjectId, _id: string){
       try {
        const find = await creatorsModel().findById(_id)
        if(find?.followers?.includes(userId)) return true
        return false
       } catch (error) {
        throw error
       }
    }

    async followCreator(userId: ObjectId, _id: string){
        await creatorsModel().updateOne({_id}, {$addToSet: { followers: userId}})
    }

    async newFollowerRequest(userId: ObjectId, _id: string){
        try {
            
        const find = await creatorsModel().updateOne({_id}, {$addToSet: { followersRequest: userId}})
        if(find) return { status: "success", message: "follow request successfull"}
        throw new Error('cannot follow this creator')

        } catch (error) {
            throw error
        }
    }


    async checkFollowerRequest(userId: string , _id: Types.ObjectId){
        const findCreator = await creatorsModel().findOne({_id, followersRequest: { $in: new Types.ObjectId(userId)}})
        return findCreator ? true : false
    }

    async acceptFollower(userId: string, _id: Types.ObjectId){
        
      try {
            let id =  new Types.ObjectId(userId)
            await creatorsModel().updateOne({_id}, {$addToSet: {followers: id}, $pull: {followersRequest: id}})
            return { status: "success", message: "follower request accepted" };
      } catch (error) {
        throw error
      }
    }


    async unfollowCreator(userId: ObjectId, _id: string){
       try {

        const unfollow = await creatorsModel().updateOne({_id}, {$pull: {followers: userId}});
        if (unfollow.modifiedCount > 0) {
            return { status: "success", message: "unfollow successful" };
        } else {
            throw new Error("unfollow failed");
        }
        
       } catch (error) {
        throw error
       }
    }

    async toPrivateCreator(_id: string){
       try {
        
        const find = await creatorsModel().updateOne({_id}, {$set:{isPrivate: true}})
        return find.matchedCount > 0 ? true : false

       } catch (error) {
          throw error
       }
        
    }

    async toPublicCreator(_id: string){
        try {
            
        const find = await creatorsModel().updateOne({_id}, {$set:{isPrivate: false}})
        return find.matchedCount > 0 ? true : false
        
        } catch (error) {
            throw error
        }
    }
}

export default CreatorDatasource