import { Schema, Types } from "mongoose";
import { User } from "../../app";
import { ErrorHandlers } from "../../helpers/errorHandler";
import { UserDatasource } from "../auth/datasource";
import { validateMongoId } from "../users/types";
import CreatorDatasource from "./datasource";
import { Icreator, validateCreator } from "./types";
import { use } from "passport";


export const creatorMutation = {

    async signUpCreator(__:any, {data}: { data: Icreator}, context: {user: User}){
        try {
            
        validateCreator(data)
        const userId  = context?.user?._id
        if(!userId) throw new ErrorHandlers().AuthenticationError('Please login to proceed')
        const userExist = await new UserDatasource().findById(userId)
        if(!userExist) throw new ErrorHandlers().ForbiddenError('please create an account to proceed')
        const creatorExist = await new CreatorDatasource().findCreatorByUserId(userId)
        if(creatorExist) throw new ErrorHandlers().ConflicError("Creator already exist")

        const { firstName, lastName } = userExist
        if(!firstName || !lastName) throw new ErrorHandlers().UserInputError('Please provide first name and last name')
        const combinedData = { userId, firstName, lastName, ...data}

        return await new CreatorDatasource().createProfile(combinedData)

        } catch (error) {
            throw error
        }
    },

    async followCreator(__: AudioNode, {data}: {data:{creatorId: string}}, context: { user: User}){
      
        try {
            
            validateMongoId(data.creatorId);
            const { creatorId } = data;
    
            const userId = context?.user?._id;
            if (!userId) throw new ErrorHandlers().AuthenticationError('Please login to proceed');
    
            const creatorExist = await new CreatorDatasource().creatorExist(creatorId);
            if (!creatorExist) throw new ErrorHandlers().NotFound('Creator does not exist');
            const isFollowing = await new CreatorDatasource().checkFollowing(userId, creatorId);
            if (isFollowing) throw new ErrorHandlers().ConflicError('You are already following this creator');
            if(creatorExist.isPrivate) return await new CreatorDatasource().newFollowerRequest(userId, creatorId)
    
            await new CreatorDatasource().followCreator(userId, creatorId);
            return { "status": "success", message: 'Successfully followed the creator' };

        } catch (error) {
            throw error
        }
    },

    async acceptFollower(__: any, {data}: {data: {userId: string}}, context: {user: User}){
      try {

        validateMongoId(data.userId);
        const { userId } = data;
        

        const creatorUserId = context?.user?._id;
        if (!creatorUserId) throw new ErrorHandlers().AuthenticationError('Please login to proceed');

        const creatorExist = await new CreatorDatasource().findCreatorByUserId(creatorUserId);
        if (!creatorExist) throw new ErrorHandlers().NotFound('Creator does not exist');
       
        const followerRequestExist = await new CreatorDatasource().checkFollowerRequest(userId, creatorExist._id);
        if (!followerRequestExist) throw new ErrorHandlers().NotFound('Follower request does not exist');

        await new CreatorDatasource().acceptFollower(userId, creatorExist._id);
        return { "status": "success", message: 'Successfully accepted the follower request' };
    
        
      } catch (error) {
        throw error
      } 
    },

    async unfollowCreator(__: any, { data }: { data: { creatorId: string } }, context: { user: User }) {
  
        try {

            const { creatorId } = data;
            validateMongoId(creatorId);
        
            const userId = context?.user?._id;
            if (!userId) throw new ErrorHandlers().AuthenticationError('Please login to proceed');
        
            const creatorExist = await new CreatorDatasource().creatorExist(creatorId);
            if (!creatorExist) throw new ErrorHandlers().NotFound('Creator does not exist');
        
            const isFollowing = await new CreatorDatasource().checkFollowing(userId, creatorId);
            if (!isFollowing) throw new ErrorHandlers().ConflicError('You are not following this creator');
        
            await new CreatorDatasource().unfollowCreator(userId, creatorId);
            return { "status": "true", message: 'Successfully unfollowed the creator' };
            
        } catch (error) {
            throw error
        }
    },

 async toPrivateCreator(__: any, args: any, context: {user: User}){
    try {
        
    const userId = context?.user?._id
    if(!userId) throw new ErrorHandlers().AuthenticationError('Please login to proceed')
    
    const creatorExist = await new CreatorDatasource().findCreatorByUserId(userId)
    if(!creatorExist) throw new ErrorHandlers().ForbiddenError('You are not a creator')
    const update =  await new CreatorDatasource().toPrivateCreator(creatorExist._id.toString())
    if(update) return { status: "success", message: "you are now a public creator"}
    throw new Error('server error, cannot update privacy setting')

    } catch (error) {
        throw error
    }
    
 },

 async toPublicCreator(__: any, args: any, context: {user: User}){
    
    try {

    const userId = context?.user?._id
    if(!userId) throw new ErrorHandlers().AuthenticationError('Please login to proceed')
    
    const creatorExist = await new CreatorDatasource().findCreatorByUserId(userId)
    if(!creatorExist) throw new ErrorHandlers().ForbiddenError('You are not a creator')
    const update =  await new CreatorDatasource().toPublicCreator(creatorExist._id.toString())
    if(update) return { status: "success", message: "you are now a private creator"}
    throw new Error('server error, cannot update privacy setting')
    
        
    } catch (error) {
        throw error
    }
 }


    
}


