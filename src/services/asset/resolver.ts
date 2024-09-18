import AssetDatasource from "./datasource";
import { IAccount } from "../../models/user";
import { isUserAuthorized } from "../../helpers/utils/permissionChecks";
import { CreateCategoryValidation, ICategoryValidation, IUpdateCategoryValidation, UpdateAssetValidation,  } from "./validation";

interface context{
  req:Request, 
  res:Response,
   user:IAccount
  }
export const AssetMutation = {

  async addAssetCategory(__:unknown, {data}:{data:ICategoryValidation},context:context ){
    await CreateCategoryValidation(data)
    isUserAuthorized(context.user, this.addAssetCategory.name)
    return await new AssetDatasource().addAssetCategory(data)
  },

  async updateAssetCategory(__:unknown, {data}:{data:IUpdateCategoryValidation}, context:context){

    await UpdateAssetValidation(data)

    isUserAuthorized(context.user, this.updateAssetCategory.name) //check user privilege
    return await new AssetDatasource().updateAssetCategory(data)
  },

  async enableOrDisableAssetCategory(__:unknown, {categoryId, status}:{categoryId:string, status:boolean},context:context){
    isUserAuthorized(context.user, this.enableOrDisableAssetCategory.name) //check user privilege
    return await new AssetDatasource().enableOrDisableAssetCategory(categoryId, status)
  }
};


export const AssetQuery = {
  
  async getAllCategory(){
    //Open route
    return await new AssetDatasource().getAllCategory()
  },

  async getAssetCategoryById(__:unknown, {categoryId}:{categoryId:string}){
      //Open route
    return await new AssetDatasource().getAssetCategoryById(categoryId)
  }
};

