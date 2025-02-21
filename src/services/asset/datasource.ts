import Base from '../../base'
import { CreateAssetValidation, IAssetValidation, ICategoryValidation, IUpdateCategoryValidation  } from "./validation";
import __Category from '../../models/assetCategory'
import { ErrorHandlers } from '../../helpers/errorHandler';
import mongoose, { PipelineStage, Schema, Types } from 'mongoose';
import __Asset, { IAsset } from '../../models/asset'
import { AssetFetcher, QueryParams } from './externalApis/externalService';
import { PlatformEnum } from './externalApis/apiAuthHeader';
import { AssetDetailsFetcher, DetailsQueryParams } from './externalApis/externalAssetDetails';
import { ObjectId } from 'mongoose';
import likesModel from '../../models/assetLikes';
import { logger } from '../../config/logger';
import AssetModel from '../../models/asset';
import { relativeTimeRounding } from 'moment';
import __PaymentMethod, { IPaymentMethod, PaymentMethodEnum } from '../../models/paymentMethod'
import commentsModel from '../../models/assetsComment';
import { DownloadService } from './externalApis/download';
import __AssetLikes from '../../models/assetLikes'
import { IPaymentMethods } from './type';
import { GooglePayService } from '../../helpers/googlePayService';
import __Plan from '../../models/plan'
import Stripe from 'stripe'; 
import PaystackService from '../../helpers/paystackService';
import { STRIPE_SECRET_KEY } from '../../config/config';

const stripe = new Stripe(STRIPE_SECRET_KEY);
export interface PaymentMethodInput {
  method: PaymentMethodEnum
  details: Record<string, any>
  isActive: boolean
}

class AssetDatasource extends Base {


  //Asset CRUD
  async addAsset(data:IAssetValidation, authorId:string){
    await CreateAssetValidation({...data, authorId})
    const category = await __Category().findOne({_id:data.categoryId})
    if(!category) throw new ErrorHandlers().ValidationError("Asset category does not exist")
    const created = await __Asset().create({...data, authorId})
    if(created) return "Asset created successfully"
    throw new ErrorHandlers().ValidationError("Unable to create asset, please try again")
  }
  async getAssetComment(assetId:string){
    const get =  await commentsModel().find({assetId}).populate('userId')
    return get.length > 0 ? get : null

  }
  async getAllAssets(page: number = 1, limit: number = 20, searchKey: string) {
    let options = {
        page,
        limit: limit > 100 ? 100 : limit,
        sort: { createdAt: -1 },
    };

    const pipeline: PipelineStage[] = [
        {
            $match: {
                deleted: false,
                published: false,
                ...(searchKey && {
                    $or: [
                        { name: { $regex: searchKey, $options: 'i' } },
                        { description: { $regex: searchKey, $options: 'i' } },
                    ],
                }),
            },
        },
        {
            $lookup: {
                from: 'files',
                localField: 'files',
                foreignField: '_id',
                as: 'files',
            },
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
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
        ...(searchKey
            ? [
                {
                    $match: {
                        $or: [
                            { 'category.title': { $regex: searchKey, $options: 'i' } },
                            { 'category.description': { $regex: searchKey, $options: 'i' } },
                        ],
                    },
                },
            ]
            : []),
        {
            $group: {
                _id: '$_id',
                title: { $first: '$title' },
                description: { $first: '$description' },
                createdAt: { $first: '$createdAt' },
                price: { $first: '$price' },
                author: { $first: '$author' },
                tags: { $first: '$tags' },
                views: { $first: '$views' },
                downloads: { $first: '$downloads' },
                ratings: { $first: '$ratings' },
                licenseType: { $first: '$licenseType' },
                files: { $first: '$files' },
                category: { $first: '$category' },
            },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                createdAt: 1,
                price: 1,
                author: 1,
                tags: 1,
                views: 1,
                downloads: 1,
                ratings: 1,
                licenseType: 1,
                files: 1,
                category: 1,
            },
        },
    ];

    const assetModel = __Asset();
    const aggregate = assetModel.aggregate(pipeline);
    const result = await assetModel.aggregatePaginate(aggregate as any, options);

    const assetsWithLikesCount = await Promise.all(
        result.docs.map(async (item: any) => {
            const likeCounts = await this.getLikeCount(item.id)
            return { ...item, likeCounts };
        })
    );

    return {
        data: assetsWithLikesCount,
        pageInfo: {
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            totalPages: result.totalPages,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            totalDocs: result.totalDocs,
        },
    };
}



  async getAllMyAssets(page:number=1, limit:number=20, userId:ObjectId, searchKey:string) {
    let options = {
      page,
      limit: limit > 100 ? 100:limit,
      $sort:{ createdAt:-1 },
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          disable: false,
          author: userId,
          ...(searchKey && {
            $or: [
              { name: { $regex: searchKey, $options: 'i' } }, 
              { description: { $regex: searchKey, $options: 'i' } },
            ],
          }),
        },
      },
      {
        $lookup: {
          from: 'files', 
          localField: 'files', 
          foreignField: '_id', 
          as: 'files', 
        },
      },
       {
      $unwind: {
        path: '$files',
        preserveNullAndEmptyArrays: true,
      },
    },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
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
      ...(searchKey
        ? [
            {
              $match: {
                $or: [
                  { 'category.title': { $regex: searchKey, $options: 'i' } }, 
                  { 'category.description': { $regex: searchKey, $options: 'i' } },
                ],
              },
            },
          ]
        : []),
      {
        $project: {
          name: 1,
          description: 1,
          createdAt: 1,
          price: 1,
          author: 1,
          tags:1,
          views: 1,
          downloads: 1,
          ratings:1,
          licenseType:1,
          files:1,
          category: 1,
        },
      },
    ];
  

    const assetModel = __Asset();
    const aggregate = assetModel.aggregate(pipeline);
    const result = await assetModel.aggregatePaginate(aggregate as any, options);
    console.log(JSON.stringify(result, null, 2))
    return     {
      data: result.docs,
      pageInfo: {
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        totalPages: result.totalPages,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
        totalDocs: result.totalDocs,
    },
};
  }
  async getAssetById(assetId:string){
    const result = await __Asset()
    .findOne({ _id: assetId, published:false })
    .populate([ { path:'categoryId'}, { path:"files" }, { path:"author" } ]).exec()  
    
  return result;

  }

  async publishOrUnpublishAsset(assetId:string, published:boolean){
    const updated = await __Asset().updateOne({_id:assetId},{$set:{published}})
    if(updated.matchedCount > 0) return `Asset ${published  ? "published":"unpublished"} successfully.`
    throw new ErrorHandlers().UserInputError(`Unable to ${published ? 'publish' :"unpublish"} asset, try again.` )
  }
  async deleteAsset(categoryId:string){
    const deleted = await __Asset().updateOne({_id:categoryId},{ $set:{ deleted:true } })
    if(deleted.matchedCount > 0) return `Asset deleted successfully.`
    throw new ErrorHandlers().ValidationError("Unable to delete, try again.")
  }



  //Category CRUD
  async updateAssetCategory(data:IUpdateCategoryValidation){
    const {categoryId, ...body} = data
    const updated = await __Category().updateOne({ _id:categoryId }, { $set: body })
    if(updated.matchedCount > 0) return `Category updated successfully.`
    throw new ErrorHandlers().ValidationError("Unable to update asset category, try again.")
  }

  async addAssetCategory(data:ICategoryValidation){
    const updated = await __Category().create(data)
    if(updated) return "Category added successfully"
  }

  async enableOrDisableAssetCategory(assetId:string, status:boolean){
    const updated = await __Category().updateOne({ _id:assetId }, { $set: { disable:status } })
    if(updated.matchedCount > 0) return `Category ${status ? "enabled": "disabled"} successfully.`
    throw new ErrorHandlers().ValidationError("Unable to update asset category, try again.")
  }

  async getAssetCategoryById(categoryId:string){
    return __Category().findOne({_id:categoryId, deleted:false})
  }

  async deleteAssetCategory(categoryId:string){
    const deleted = await __Category().updateOne({_id:categoryId},{ $set:{ deleted:true } })
    if(deleted.matchedCount > 0) return `Category deleted successfully.`
    throw new ErrorHandlers().ValidationError("Unable to validate or update asset category, try again.")
  }

  async getAllCategory(){
    return __Category().find({disable:false})
  }

  async likeAsset(userId: ObjectId, assetId: string){
   try {

    const likeAsset = likesModel()
    const create = await likeAsset.create({assetId, userId})
    return create ? create.toObject() : null

   } catch (error) {
    logger.error(error)
    throw error
   } 
  }

  async getCreator(assetId: string){
   try {
    
    const userId = await AssetModel().findById(new mongoose.Types.ObjectId(assetId)).populate('author')
    return userId ? userId.toObject() : null

   } catch (error) {
    logger.error(error)
    throw error
   }
  }

  async unlikeAsset(userId: ObjectId, assetId: string){
   try {

    const find = await likesModel().findOneAndDelete({userId, assetId})
    return find ? true : null

   } catch (error) {
    logger.error(error)
   }
  }

  async getLikeCount(assetId: string){
    const findAll = await likesModel().find({assetId}).count()
    return findAll
  }


  async assetComment(userId: ObjectId, assetId: string, comment: string){
    try {
      const create = await commentsModel().create({
        assetId,
        userId,
        comment
      })
  
      if(create) return create.toObject()
      throw new ErrorHandlers().UserInputError('Unable to create comment, try again')
    } catch (error) {
      throw error
    }
  }

  async deleteComment(_id: string, assetId: string, userId: ObjectId){
    const remove = await commentsModel().findOneAndDelete({_id,assetId,userId})
    if(remove) return {message: 'Coment deleted successfully', status: "success"} 
    else { throw new ErrorHandlers().NotFound('comment not found') }
  }

  async getExternalAsset(platform:PlatformEnum, params:QueryParams){
    return await new AssetFetcher(platform).fetchAssets(params)

  }

  async getAssetDetails(platform:PlatformEnum, params:DetailsQueryParams){
    return await new AssetDetailsFetcher(platform).fetchAssetDetails(params)
}


//CREATOR's DASHBOARD STATISTICS
async  getUploadStatusStatistics(authorId:string) {
    const pipeline = [
      {
          $match: { authorId: new mongoose.Types.ObjectId(authorId) }
      },
      {
          $group: {
              _id: '$status',
              count: { $sum: 1 }
          }
      },
      {
        
          $project: {
              status: '$_id',
              count: 1,
              _id: 0 
          }
      }
  ]

      const result = await __Asset().aggregate(pipeline);
      return result; 
}

async  getAssetAnalytics(authorId: string) {
  const pipeline = [
      {
          $match: { authorId: new mongoose.Types.ObjectId(authorId) }
      },
      {
          $lookup: {
              from: 'downloads',
              localField: '_id',
              foreignField: 'assetId',
              as: 'downloadData'
          }
      },
      {
          $unwind: {
              path: '$downloadData',
              preserveNullAndEmptyArrays: true
          }
      },
      {
          $group: {
              _id: '$_id', 
              title: { $first: '$title' },
              downloads: { $sum: { $cond: [{ $ifNull: ['$downloadData', false] }, 1, 0] } },
              views: { $sum: '$views' },
              ratingsCount: { $sum: '$ratings.count' },
              ratingsTotal: { $sum: '$ratings.total' },
              earnings: { $sum: { $multiply: [{ $ifNull: ['$downloadData', 0] }, '$price'] } }
          }
      },
      {
          $project: {
              _id: 1, 
              title: 1,
              downloads: { $ifNull: ['$downloads', 0] },
              views: { $ifNull: ['$views', 0] },
              ratingsCount: { $ifNull: ['$ratingsCount', 0] },
              averageRating: { 
                  $cond: [{ $eq: ['$ratingsCount', 0] }, 0, { $divide: ['$ratingsTotal', '$ratingsCount'] }] 
              },
              earnings: { $ifNull: ['$earnings', 0] }
          }
      }
  ];
 return await __Asset().aggregate(pipeline).exec();

}



//CREATOR PAYMENT METHOD

  async getPaymentMethods(userId: string )  {
      return await __PaymentMethod().find({ userId });
  }

  async addPaymentMethod (payload: PaymentMethodInput, userId:string ) {
      return await __PaymentMethod().create({...payload, userId});
   
  }
  
  async updatePaymentMethod(id:string, payload: PaymentMethodInput, userId:string ){
      return await __PaymentMethod().findByIdAndUpdate(id, payload, { new: true });
  }
  
  async deletePaymentMethod(id: string ){
     const res =  await __PaymentMethod().findByIdAndDelete(id);
     if(res) return true;
     return false
  }


  async downloadAsset(platform: PlatformEnum, relativePath:string, itemId:string, itemFormat?:string){
    return await new DownloadService().downloadFreePikAsset(platform, relativePath, itemId, itemFormat)
  }

  async processPayment(planId:string, paymentMethod:IPaymentMethods, user:any){
 
    try {
  
      const {amount, baseCurrency} =  await __Plan().findById(planId)
     //TODO: convert baseCurrency to the user currency
      const currency = baseCurrency

      if (paymentMethod === IPaymentMethods.GPAY) {
        const googlePayService = new GooglePayService()
        const paymentData =  googlePayService.createPaymentData(amount.toString(), currency); 
        const token = await googlePayService.processPayment(paymentData);

        const charge = await stripe.charges.create({
          amount: parseInt(amount.toString()) * 100, 
          currency:currency,
          source: token, 
          receipt_email: user.email,
          metadata: { planId },
        });

        return charge; 

      } else if (paymentMethod === IPaymentMethods.PAYSTACK) {
        const paystackProcessing = new PaystackService().processData({reference:planId})
    return paystackProcessing

      } else {
        throw new ErrorHandlers().UserInputError('Invalid payment method.');
      }
    } catch (error) {
      console.error("Payment Error:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }


}
export default AssetDatasource

