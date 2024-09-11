import PermissionDatasource from "./datasource";

import { IAccount } from "../../models/user";
import { CreatePermissionGroupValidation, IPermissionGroup, IUpdatePermissionGroup, UpdatePermissionGroupValidation } from "./validation";
import { isUserAuthorized } from "../../helpers/utils/permissionChecks";
import { Types } from "mongoose";
import { BadreqError } from "../../middleware/errors";



export const PermissionMutation = {

  async createPermissionGroup(__:unknown, {data}:{data:IPermissionGroup}, context:{req:Request, res:Response, user:IAccount}){
    await CreatePermissionGroupValidation(data)
    isUserAuthorized(context.user, this.createPermissionGroup.name) //check user privilege
    return await new PermissionDatasource().createPermissionGroup(data)

  },

  async updatePermissionGroup(__:unknown, {data}:{data:IUpdatePermissionGroup}, context:{req:Request, res:Response, user:IAccount}){
    await UpdatePermissionGroupValidation(data)
    isUserAuthorized(context.user, this.updatePermissionGroup.name) //check user privilege
    return await new PermissionDatasource().updatePermissionGroup(data)
  },

  async disablePermissionGroup(__:unknown, {permissionGroupId}:{permissionGroupId:string}, context:{req:Request, res:Response, user:IAccount}){
    
    if (!Types.ObjectId.isValid(permissionGroupId)) {
      throw new BadreqError('Invalid permission group id');
    }

    isUserAuthorized(context.user, this.disablePermissionGroup.name) //check user privilege
    return await new PermissionDatasource().disablePermissionGroup(permissionGroupId)
  },

};


export const PermissionQuery = {

 async getAllPermissionGroup(_:unknown, __:unknown, context:{req:Request, res:Response, user:IAccount}){
  isUserAuthorized(context.user, this.getAllPermissionGroup.name) //check user privilege
  return await new PermissionDatasource().getAllPermissionGroup()
  },

  
  async getAllDefaultPermissions(_:unknown, {page, limit}:{page:number, limit:number}, context:{req:Request, res:Response, user:IAccount}){
    isUserAuthorized(context.user, this.getAllDefaultPermissions.name) //check user privilege
    return await new PermissionDatasource().getAllDefaultPermissions(page, limit)
  }



  
};

