import { ObjectId } from "mongoose";
import Base from "../../base";
import savedAssetsModel from "../../models/savedAssets";
import downloadsModel from "../../models/downloads";
import { logger } from "../../config/logger";
import purchaseHistoryModel from "../../models/purchaseHistory";
import subscriptionsModel from "../../models/subscription";


export class datasource extends Base {

    async getDownloads(userId: ObjectId){
        try {
        return await downloadsModel().find({userId}).populate('assetId')
        } catch (error) {
         logger.error(error)
         throw error
        }
      }

      
    async getsavedAssets(userId: ObjectId){
       try {
        return await savedAssetsModel().find({userId}).populate('assetId')
       } catch (error) {
        logger.error(error)
        throw error
       }
    }
    
    async getPurchaseHistory(userId: ObjectId){
        try {
            return await purchaseHistoryModel().find({userId}).populate('userPaymentMethod') 
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
 
    async getSubcriptionHistory(userId: ObjectId){
        try {
            return await subscriptionsModel().find({userId}).populate('userPaymentMethod')
        } catch (error) {
            logger.error(error)
            throw error
        }
    }




}