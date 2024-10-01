import Base from '../../base'
import { ICategoryValidation, IUpdateCategoryValidation  } from "./validation";
import __Category from '../../models/assetCategory'
import { ErrorHandlers } from '../../helpers/errorHandler';
import { PipelineStage, Schema } from 'mongoose';
import __Asset from '../../models/asset'
import { AssetFetcher, QueryParams } from './externalApis/externalService';
import { PlatformEnum } from './externalApis/apiAuthHeader';
import { AssetDetailsFetcher, DetailsQueryParams } from './externalApis/externalAssetDetails';


class AssetDatasource extends Base {


  //Asset CRUD
  async getAllAssets(page:number=1, limit:number=20, searchKey:string) {
    let options = {
      page,
      limit: limit > 100 ? 100:limit,
      $sort:{ createdAt:-1 },
    }

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
  async getAllMyAssets(page:number=1, limit:number=20, userId:string, searchKey:string) {
    let options = {
      page,
      limit: limit > 100 ? 100:limit,
      $sort:{ createdAt:-1 },
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          disable: false,
          author: new Schema.Types.ObjectId(userId),
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

  async getExternalAsset(platform:PlatformEnum, params:QueryParams){
    return await new AssetFetcher(platform).fetchAssets(params)

  }

  async getAssetDetails(platform:PlatformEnum, params:DetailsQueryParams){
    return await new AssetDetailsFetcher(platform).fetchAssetDetails(params)
}
}
export default AssetDatasource

