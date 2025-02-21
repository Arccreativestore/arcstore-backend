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


const getUserProfile = {
    async getUserProfile(__:any, args: any, context: {user: User}){
      const userId = context?.user?._id
      if(!userId) throw new ErrorHandlers().AuthenticationError('Please login to proceed')
      return await new UserDatasource().findById(userId)
    },

    async getUserCurrentLocation(__:any, args: any, context: {user: User, req:Request}){
      return await new datasource().getUserCurrentLocation()
    },

    async amountUSDToLocalCurrency(__:unknown, {amountInUSD}: {amountInUSD:number}, context: {user: User, req:Request}){
      return await new datasource().amountUSDToLocalCurrency(amountInUSD)
    },
}


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
    },

    async saveAsset(__: any, {data}: {data: {assetId: string}}, context: { user: User}){
     try {
      const assetId = data.assetId
      validateMongoId(assetId)
      const userId = context.user?._id;
      if (!userId) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed');
      const assetAlreadySaved = await new datasource().assetAlreadySaved(userId, assetId)
      if(assetAlreadySaved) throw new ErrorHandlers().ConflicError('Asset already saved')
      const save = await new datasource().saveAsset(userId, assetId)
      if(!save) throw new Error('could not save assets at this time')
      return { status: "success", message: "asset saved"}
    
     } catch (error) {
      throw error
     }},

    async unsaveAsset(__: any, {data}: {data: {assetId: string}}, context: { user: User}){
     try {
      const assetId = data.assetId
      validateMongoId(assetId)
      const userId = context.user?._id;
      if (!userId) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed');
      const assetAlreadySaved = await new datasource().assetAlreadySaved(userId, assetId)
      if(!assetAlreadySaved) throw new ErrorHandlers().ConflicError('Asset is not saved')
      const unsave = await new datasource().unsaveAsset(userId, assetId)
      if(!unsave) throw new Error('could not unsave asset at this time')
        return { status: "success", message: "asset unsaved"}
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
  ...deleteUserAccount,
  ...getUserProfile
}

export default UserQueries