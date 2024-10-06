import { Request } from "express";
import { User } from "../../app";
import { userInfo } from "os";
import { ErrorHandlers } from "../../helpers/errorHandler";
import { datasource } from "./datasource";
import Joi from "joi";
import { Types } from "mongoose";
import purchaseHistoryModel from "../../models/purchaseHistory";
import { downloadType, purchaseHistoryType, savedAssetType, validateMongoId } from "./types";
import { Icreator } from "../../models/creator";
import { UserDatasource } from "../auth/datasource";



const downloadsQuery = {

    async getDownloads(__: any, args: any, context: {user: User}){
        
       try {

        const userId = context.user?._id;
        if (!userId) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed');
        return await new datasource().getDownloads(userId)
       } catch (error) {
        throw error
       }
    }
}


const savedAssetsQuery = {

    async getsavedAssets(__: any, args: any, context: {user: User}){
        
      try {
        const userId = context.user?._id;
        if (!userId) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed');
        return await new datasource().getsavedAssets(userId)
      } catch (error) {
        throw error
      }
    }
}


const purchaseHistoryQuery = {
    async getPurchaseHistory(__:any, args: any, context: {user: User}){

       try {

        const userId = context.user?._id;
        if (!userId) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed'); 
        validateMongoId(userId)
        const PurchaseHistory = await new datasource().getPurchaseHistory(userId)
        return PurchaseHistory.length > 0 ? PurchaseHistory : []

       } catch (error) {
        throw error
       }
    }
}

const subscriptionQuery = {
  async getSubcriptionHistory(__:any, args: any, context: {user: User}){
       try {

       const userId = context?.user?._id
       if(!userId || !context.user) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
       validateMongoId(userId)
      
       const getSubs = await new datasource().getSubcriptionHistory(userId)
       return getSubs.length > 0 ? getSubs : []
       
       } catch (error) {
        throw error
       }
  }
}

const disableUserAccount = {
  async disableUserAccount(__: any, args: any, context: {user:User}){
    try {
      
    const userId = context?.user?._id
    console.log(context.user)
    if(!userId) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
    return await new datasource().disableUserAccount(userId)

    } catch (error) {
      throw error
    }
  }
}

const deleteUserAccount = {
  async deleteUserAccount(__: any, args: any, context: {user:User}){
    try {
      
    const userId = context?.user?._id
    if(!userId) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
    return await new datasource().deleteUserAccount(userId)

    } catch (error) {
      throw error
    }
  }
}


const UserQueries =  {
  ...downloadsQuery,
  ...savedAssetsQuery,
  ...purchaseHistoryQuery,
  ...subscriptionQuery,
  ...disableUserAccount,
  ...deleteUserAccount
}

export default UserQueries