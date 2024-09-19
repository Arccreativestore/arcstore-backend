import GeneralController from './helpers/generalController'
import jwt from 'jsonwebtoken'
import { userModel } from './models/user'
import mongoose from 'mongoose'
import { ACCESS_SECRETKEY } from './config/config'
import {v4 as uuid} from 'uuid'

export default class Base extends GeneralController {
  decodeToken(token: string) {
    return jwt.verify(token, ACCESS_SECRETKEY as string)
  }

  isTokenExpired(decoded: any) {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTimeInSeconds
  }

  async extractUserDetails(token: string) {
    const payload: any = this.decodeToken(token)

    const tokenExpired = false

    if (!tokenExpired) {
      const pipeline: any[] = [
        {
          $match: { _id: new mongoose.Types.ObjectId(payload._id) },
        },

        {
          $lookup: {
            from: 'permission_groups',
            localField: 'permissions',
            foreignField: '_id',
            as: 'permissionGroups',
          },
        },

        {
          $unwind: {
            path: '$permissionGroups',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: 'permissions',
            localField: 'permissionGroups.permissions',
            foreignField: '_id',
            as: 'permissions',
          },
        },
        {
          $group: {
            _id: '$_id',
            firstName: { $first: '$firstName' },
            lastName: { $first: '$lastName' },
            email: { $first: '$email' },
            role: { $first: '$role' },
            permissions: {
              $push: '$permissions.method',
            },
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            permissions: {
              $reduce: {
                input: '$permissions',
                initialValue: [],
                in: { $concatArrays: ['$$value', '$$this'] },
              },
            },
          },
        },
      ]


      
      const [userData]: any = await userModel(true).aggregate(pipeline).exec()
      return userData
    }

    return
  }

  generateUniqueId(){
    return uuid()
}
}
