import { ObjectId, PipelineStage } from "mongoose";
import { logger } from "../../config/logger";
import fcmModel from "../../models/fcmTokens";
import pushNotificationModel from "../../models/pushNotifications";
import CategoryModel from "../../models/assetCategory";
import AssetModel from "../../models/asset";
import moment from 'moment'
import { userModel } from "../../models/user";


class datasource {

    async subToPush(userId: ObjectId, fcmToken: string){
        try {
            const user = await userModel().findById(userId).select('preferences');
            const preferences = user ? user.preferences : [];
            const create = await fcmModel().create({ userId, fcmToken, preferences });
            return create ? ' User subscribed successfully' : 'failed to subscribe user'
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
    async getUserToken(){
        try {
        return await fcmModel().find()
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    async savePush(title: string, message: string, forwardedTo: Array<string>){
        try {
            
            const push = pushNotificationModel()
            const create =  new push({
                title,
                message,
                forwardedTo
            })
            await create.save()
        } catch (error) {
            logger.error(error)
        }
    }

    async getPushHistory(limit?: number, page?: number)
    {
       try {
        
        if(limit){if(limit>100) limit = 100}
        const options = {
            limit: limit ? limit : 10,
            page: page? page : 1,
            $sort:{ createdAt:-1 },
        }
    
        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: 'pushNotifications',
                    localField: '_id',         
                    foreignField: 'userId',   
                    as: 'pushNotifications'
                }
            },
            {
                $unwind: {
                    path: '$pushNotifications',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    title: '$pushNotifications.title',    
                    message: '$pushNotifications.message', 
                    createdAt: '$pushNotifications.createdAt', 
                }
            }
        ];

        const pushModelInstance = pushNotificationModel();
        const aggregate = pushModelInstance.aggregate(pipeline);
        const result = await pushModelInstance.aggregatePaginate(aggregate as any, options);
        return {
          data: result.docs,
          pageInfo: {
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            totalPages: result.totalPages,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            totalDocs: result.totalDocs,
          },
        }
       } catch (error) {
        logger.error(error)
       }
    }

    async categoriesWithUploads(){
       
        try {
            const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
        const pipeline = [
            {
                $match: {
                    createdAt: { $gte: oneWeekAgo },
                    deleted: false,
                    published: true,
                },
            },
            {
                $group: {
                    _id: '$categoryId',
                    assetCount: { $sum: 1 },
                },
            },
            {
                $match: {
                    assetCount: { $gt: 7 },
                },
            },
        ];
    
        const result = await AssetModel().aggregate(pipeline);
        return result.map(doc => doc._id);

        } catch (error) {
            logger.error(error)
        }
    }

    async getFcmTokensForCategories(categoryIds: ObjectId[]) {
      try {
        
        const fcmTokensDocs = await fcmModel().find({
            preferences: { $in: categoryIds },
        }).select('fcmToken');
    
        const fcmTokens = [...new Set(fcmTokensDocs.map(doc => doc.fcmToken))];
        return fcmTokens;

      } catch (error) {
        logger.error(error)
        throw error
      }
    }
    

}


export default datasource