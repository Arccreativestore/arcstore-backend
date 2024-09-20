import { Request } from "express";
import { User } from "../../app";
import { userInfo } from "os";
import { ErrorHandlers } from "../../helpers/errorHandler";
import { datasource } from "./datasource";
import Joi from "joi";
import { Types } from "mongoose";
import purchaseHistoryModel from "../../models/purchaseHistory";
import { downloadType, purchaseHistoryType, savedAssetType, validateMongoId } from "./types";



const downloadsQuery = {

    async getDownloads(_: any, args: any, context: {user: User}){
        
       try {

        const userId = context.user?._id;
        if (!userId) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed');
        validateMongoId(userId)
        return await new datasource().getDownloads(userId)
       } catch (error) {
        throw error
       }
    }
}


const savedAssetsQuery = {

    async getsavedAssets( savedAssets_: any, args: any, context: {user: User}){
        
      try {
        const userId = context.user?._id;
        if (!userId) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed');
        validateMongoId(userId)
        return await new datasource().getsavedAssets(userId)
      } catch (error) {
        throw error
      }
    }
}


const purchaseHistoryQuery = {
    async getPurchaseHistory(_:any, args: any, context: {user: User}){

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


const UserQueries =  {
  ...downloadsQuery,
  ...savedAssetsQuery,
  ...purchaseHistoryQuery,
  ...subscriptionQuery
}

export default UserQueries