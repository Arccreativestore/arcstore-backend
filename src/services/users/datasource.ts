import { ObjectId, PipelineStage, Schema } from "mongoose";
import Base from "../../base";
import savedAssetsModel from "../../models/savedAssets";
import downloadsModel from "../../models/downloads";
import { logger } from "../../config/logger";
import purchaseHistoryModel from "../../models/purchaseHistory";
import subscriptionsModel from "../../models/subscription";


export class datasource extends Base {

    async getDownloads(userId: ObjectId, limit?: number, page?: number){
        try {
         return execPipeline(userId, limit, page)
        }catch(error) {
         logger.error(error)
         throw error
        }
    }
 
    async getsavedAssets(userId: ObjectId, limit?: number, page?: number){
       try {
        return execPipeline(userId, limit, page)
       } catch (error) {
        logger.error(error)
        throw error
       }
    }
    // adjust to pipeline when payment methods db has been implemented
    async getPurchaseHistory(userId: ObjectId){
        try {
            return await purchaseHistoryModel().find({userId}).populate('userPaymentMethod') 
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
    // adjust when schema has been implemented
    async getSubcriptionHistory(userId: ObjectId){
        try {
            return await subscriptionsModel().find({userId}).populate('userPaymentMethod')
        } catch (error) {
            logger.error(error)
            throw error
        }
    }
}

async function execPipeline(userId: ObjectId, limit?: number, page?: number){
    
    if(limit) { if(limit > 100) limit = 10}

    const options = {
      page: page ? page : 1,
      limit: limit,
      sort: { downloadedAt: -1 }, 
  };

  const pipeline: PipelineStage[] = [
      {
          $match: {
              userId: userId, 
          },
      },
      {
          $lookup: {
              from: 'assets', 
              localField: 'assetId',
              foreignField: '_id',
              as: 'asset',
          },
      },
      {
          $unwind: {
              path: '$asset',
              preserveNullAndEmptyArrays: false,
          },
      },
      {
          $lookup: {
              from: 'files',
              localField: 'asset.files',
              foreignField: '_id',
              as: 'files',
          },
      },
      {
          $lookup: {
              from: 'categories', 
              localField: 'asset.categoryId',
              foreignField: '_id',
              as: 'category',
          },
      },
      {
          $unwind: {
              path: '$category', 
              preserveNullAndEmptyArrays: true, 
          },
      },
      {
          $project: {
              createdAt: 1,
              asset: {
                  title: 1,
                  description: 1,
                  price: 1,
                  author: 1,
                  licenseType: 1
              },
              category: {
                  title: 1,
                  slug: 1,
                  description: 1,
                  disable: 1,
                  deleted: 1,
              },
              files: {
                  thumbnailUrl: 1,
                  type: 1,
              },
          },
      },
  ];


  const savedAssetsModelInstance = savedAssetsModel();
  const aggregate = savedAssetsModelInstance.aggregate(pipeline);
  const result = await savedAssetsModelInstance.aggregatePaginate(aggregate as any, options);
  console.log(result.docs[0].files)
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
}