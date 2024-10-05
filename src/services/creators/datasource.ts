import { defineArguments } from "graphql/type/definition";
import creatorsModel from "../../models/creator";
import { UserDatasource } from "../auth/datasource";
import { userModel } from "../../models/user";
import mongoose, { ObjectId, Schema, Types } from "mongoose";



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
        const find = await creatorsModel().findOne({userId: _id})
        if(find) return find.toObject()
        return null
    }

    async checkFollowing(userId: ObjectId, _id: string){
        const find = await creatorsModel().findById(_id)
        if(find?.followers?.includes(userId)) return true
        return false
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


    async checkFollowerRequest(userId: string , creator: any){
    
        if (!creator) return false;
        const followersRequestStrings = creator.followersRequest.map((id: ObjectId) => id.toString());
        console.log(followersRequestStrings)
        if (followersRequestStrings.includes(userId)) return true;
        return false;
    }


    async acceptFollower(userId: string, creator: any){
        
      try {
        const requestArray = creator.followersRequest.map((id: ObjectId)=> id.toString())
        const requestIndex = requestArray.i ndexOf(userId);
        console.log(requestIndex)
        if (requestIndex !== -1) {
            creator.followersRequest.splice(requestIndex, 1);
            creator.followers.push(userId);
            //const await creatorsModel().find
            await creator.save();
            return { status: "success", message: "follower request accepted" };
        } else {
            throw new Error('Follower request not found');
        }

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

    async privateCreator(_id: string){
        const find = await creatorsModel().updateOne({_id}, {$set:{isPrivate: true}})
        return find.matchedCount > 0 ? true : false
        
    }
}

export default CreatorDatasource