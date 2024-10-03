import AssetDatasource from "./datasource";
import { IAccount } from "../../models/user";
import { isUserAuthorized } from "../../helpers/utils/permissionChecks";
import { CreateCategoryValidation, ICategoryValidation, IUpdateCategoryValidation, UpdateAssetValidation,  } from "./validation";
import { User } from "../../app";
import { ErrorHandlers } from "../../helpers/errorHandler";
import { validateMongoId } from "../users/types";
import { notifyCreator } from "./helper";

interface context{
  req:Request, 
  res:Response,
  user:User
  }
export const AssetMutation = {

  async addAssetCategory(__:unknown, {data}:{data:ICategoryValidation},context:context ){
    await CreateCategoryValidation(data)
    isUserAuthorized(context.user, this.addAssetCategory.name)
    return await new AssetDatasource().addAssetCategory(data)
  },

  async updateAssetCategory(__:unknown, {data}:{data:IUpdateCategoryValidation}, context:context){
    await UpdateAssetValidation(data)
    isUserAuthorized(context.user, this.updateAssetCategory.name) 
    return await new AssetDatasource().updateAssetCategory(data)
  },

  async enableOrDisableAssetCategory(__:unknown, {categoryId, status}:{categoryId:string, status:boolean},context:context){
    isUserAuthorized(context.user, this.enableOrDisableAssetCategory.name) 
    return await new AssetDatasource().enableOrDisableAssetCategory(categoryId, status)
  },

  async publishOrUnpublishAsset(__:unknown, {assetId, publish}:{assetId:string, publish:boolean},context:context){
    isUserAuthorized(context.user, this.publishOrUnpublishAsset.name) 
    return await new AssetDatasource().publishOrUnpublishAsset(assetId, publish)
  },
  async deleteAssetCategory(__:unknown, {categoryId}:{categoryId:string},context:context){
    isUserAuthorized(context.user, this.deleteAssetCategory.name) 
    return await new AssetDatasource().deleteAssetCategory(categoryId)
  },
  async deleteAsset(__:unknown, {assetId}:{assetId:string},context:context){
    isUserAuthorized(context.user, this.deleteAsset.name) 
    return await new AssetDatasource().deleteAsset(assetId)
  },

  async likeAsset(__: unknown, {data}:{data:{assetId: string}}, context: context){
    
   try {
    const { assetId } = data
    const user = context?.user
    if(!user || !user._id) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
    const userId = user?._id
    validateMongoId(assetId)

    const likeAsset = await new AssetDatasource().likeAsset(userId, assetId)
    if(!likeAsset) throw new Error('Cannot like post at this time')
    notifyCreator(userId, assetId, "Liked")
    return { status: "success",  message: "User liked post successfully"}


   } catch (error) {
    throw error
   }
  },
 
  async unlikeAsset(__: unknown, {data}:{ data: {assetId: string}}, context: context){

    const user = context?.user
    if(!user || !user._id) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
    const assetId = data?.assetId
    const userId = user?._id
    validateMongoId(assetId)

    const unlikeAsset = await new AssetDatasource().unlikeAsset(userId, assetId)
    if(!unlikeAsset) throw new Error('Asset does not exist')
    return { status: "success",  message: "User unliked asset successfully"}

  },

  async getLikeCount(__: any, {data}: {data: {assetId: string}}){

    const assetId = data?.assetId
    validateMongoId(assetId)
    return await new AssetDatasource().getLikeCount(assetId)
  },

  async assetComment(__: unknown, {data}: {data: {assetId: string, comment: string}}, context: context){

    const user = context?.user
    if(!user || !user._id) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
    const assetId = data?.assetId
    const comment = data?.comment
    const userId = user?._id
    validateMongoId(assetId)

    return await new AssetDatasource().assetComment(userId, assetId, comment)
  },

  async deleteComment(__: unknown, { data }: { data: {assetId: string, commentId: string}}, context: context){

    const user = context?.user
    if(!user || !user._id) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
    const assetId = data?.assetId
    const _id = data?.commentId
    const userId = user?._id
    validateMongoId(assetId)
    validateMongoId(_id)

    return await new AssetDatasource().deleteComment(_id, assetId, userId)
  }

};


export const AssetQuery = {
  
  async getAllCategory(){
    return await new AssetDatasource().getAllCategory()
  },

  async getAssetCategoryById(__:unknown, {categoryId}:{categoryId:string}){
    return await new AssetDatasource().getAssetCategoryById(categoryId)
  },
  async getAssetById(__:unknown, {assetId}:{assetId:string}){
    return await new AssetDatasource().getAssetById(assetId)
  },

  async getAllAssets(__:unknown, {page, limit, search}:{page:number, limit:number, search:string},context:context){
    return await new AssetDatasource().getAllAssets(page, limit, search)
  },

  async getAllMyAssets(__:unknown, {page, limit, search}:{page:number, limit:number, search:string},context:context){
   // isUserAuthorized(context.user, this.getAllMyAssets.name) 
    return await new AssetDatasource().getAllMyAssets(page, limit, context.user._id,  search)
  }


};

