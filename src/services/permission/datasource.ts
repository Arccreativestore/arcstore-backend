import Base from '../../base'
import { IPermissionGroup, IUpdatePermissionGroup } from './validation'
import __PermissionGroupModel from '../../models/permissionGroup'
import __Permission from '../../models/permission'
import { logger } from '../../config/logger'
import { PipelineStage } from 'mongoose'

class PermissionDatasource extends Base {

  async createPermissionGroup(data: IPermissionGroup) {

    try {
      const created = await __PermissionGroupModel().create(data)
      if(created) return "Permission group created successfully"
    } catch (error) {
      logger.error(error)
      throw new Error(error.message)
    }
  }


  async updatePermissionGroup(data: IUpdatePermissionGroup) {
  try {
    const {permissionGroupId, ...rest} = data
    const updated = await __PermissionGroupModel().updateOne({_id:permissionGroupId}, {$set:rest})
    if(updated.matchedCount > 0) return "Permission group updated successfully"
  } catch (error) {
    logger.error(error)
    throw new Error(error.message)
  }

  }

  async disablePermissionGroup(permissionGroupId: string) {
    try {
      const updated = await __PermissionGroupModel().updateOne({_id:permissionGroupId}, {$set:{disable:true}})
      if(updated.matchedCount > 0) return "Permission group disabled successfully"
    } catch (error) {
      logger.error(error)
      throw new Error(error.message)
    }
  }

  async getAllPermissionGroup() {
    const pipeline: PipelineStage[] = [
      {
          $match: {
              disable: false, 
          },
      },
      {
          $lookup: {
              from: 'permissions', 
              localField: 'permissions', 
              foreignField: '_id', 
              as: 'permissionsDetails', 
          },
      },
      {
          $project: {
              title: 1,
              description: 1,
              permissions: 1,
              disable: 1,
              createdAt:1,
              updatedAt:1,
              permissionsDetails: 1,
          },
      },
  ];

    return __PermissionGroupModel().aggregate(pipeline).exec()
  }

  async getAllDefaultPermissions(page:number=1, limit:number=20) {
    let options = {
      page,
      limit: limit > 100 ? 100:limit,
      $sort:{ createdAt:-1 }
    }

    const pipeline:PipelineStage[]=[
      {
        $match:{
          disable:false
        }
      }
    ]

    const permissionModel = __Permission();
    const aggregate = permissionModel.aggregate(pipeline);
    const result = await permissionModel.aggregatePaginate(aggregate as any, options);
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
    };
  }
}

export default PermissionDatasource

