import AssetDatasource from "./datasource";
import { IAccount } from "../../models/user";
import { isUserAuthorized } from "../../helpers/utils/permissionChecks";
import { CreateCategoryValidation, ICategoryValidation, IUpdateCategoryValidation, UpdateAssetValidation,  } from "./validation";
import { PlatformEnum } from "./externalApis/apiAuthHeader";
import { QueryParams } from "./externalApis/externalService";
import { DetailsQueryParams } from "./externalApis/externalAssetDetails";

interface context{
  req:Request, 
  res:Response,
   user:IAccount
  }
export const AssetMutation = {

  async addAssetCategory(__:unknown, {data}:{data:ICategoryValidation},context:context ){
    await CreateCategoryValidation(data)
   // isUserAuthorized(context.user, this.addAssetCategory.name)
    return await new AssetDatasource().addAssetCategory(data)
  },

  async updateAssetCategory(__:unknown, {data}:{data:IUpdateCategoryValidation}, context:context){
    await UpdateAssetValidation(data)
    // isUserAuthorized(context.user, this.updateAssetCategory.name) 
    return await new AssetDatasource().updateAssetCategory(data)
  },

  async enableOrDisableAssetCategory(__:unknown, {categoryId, status}:{categoryId:string, status:boolean},context:context){
    // isUserAuthorized(context.user, this.enableOrDisableAssetCategory.name) 
    return await new AssetDatasource().enableOrDisableAssetCategory(categoryId, status)
  },

  async publishOrUnpublishAsset(__:unknown, {assetId, publish}:{assetId:string, publish:boolean},context:context){
    // isUserAuthorized(context.user, this.publishOrUnpublishAsset.name) 
    return await new AssetDatasource().publishOrUnpublishAsset(assetId, publish)
  },
  async deleteAssetCategory(__:unknown, {categoryId}:{categoryId:string},context:context){
    // isUserAuthorized(context.user, this.deleteAssetCategory.name) 
    return await new AssetDatasource().deleteAssetCategory(categoryId)
  },
  async deleteAsset(__:unknown, {assetId}:{assetId:string},context:context){
    // isUserAuthorized(context.user, this.deleteAsset.name) 
    return await new AssetDatasource().deleteAsset(assetId)
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
  },
  async getExternalAsset(_:unknown, {platform, params}:{platform:PlatformEnum, params:QueryParams},context:context){
    return new AssetDatasource().getExternalAsset(platform, params)
  },

  async getFreePikAsset(_:unknown, {platform, params}:{platform:PlatformEnum, params:QueryParams},context:context){
    return new AssetDatasource().getExternalAsset(platform, params)
  },
  
  async getFreePikAssetDetails(_:unknown, {platform, params}:{platform:PlatformEnum, params:DetailsQueryParams},context:context){
      return new AssetDatasource().getAssetDetails(platform, params)
  }

};

