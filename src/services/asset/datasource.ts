import Base from '../../base'
import { ICategoryValidation, IUpdateCategoryValidation  } from "./validation";
import __Category from '../../models/assetCategory'
import { ErrorHandlers } from '../../helpers/errorHandler';


class AssetDatasource extends Base {


  //Asset CRUD
  async getAllAssets() {}
  async getAllMyAssets() {}
  async getAssetById(){}

  async approveAsset(assetId:string){}




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
    throw new ErrorHandlers().ValidationError("Unable to validate or update asset category, try again.")
  }

  async getAssetCategoryById(categoryId:string){
    return __Category().findOne({_id:categoryId, deleted:false})
  }

  async deleteAssetCategory(categoryId:string){
    const deleted = await __Category().updateOne({_id:categoryId},{ $set:{ disable:true } })
    if(deleted.matchedCount > 0) return `Category deleted successfully.`
    throw new ErrorHandlers().ValidationError("Unable to validate or update asset category, try again.")
  }

  async getAllCategory(){
    return __Category().find({disable:false})
  }
}

export default AssetDatasource

