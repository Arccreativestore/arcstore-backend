import { PipelineStage } from "mongoose";
import { logger } from "../../config/logger";
import fcmModel from "../../models/fcmTokens";
import pushNotificationModel from "../../models/pushNotifications";




class datasource {

    async getUserToken(){
        try {
        return await fcmModel().find({}, { userId: 0, _id: 0, fcmToken: 1}).lean().exec()
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
        
        if(limit){if(limit>100) limit = 10}
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
   
}


export default datasource