 import GeneralController from "./helpers/generalController";
import jwt from 'jsonwebtoken'
import {userModel} from './models/user'
import mongoose from "mongoose";
import { REFRESH_SECRETKEY, VERIFY_SECRETKEY } from "./config/config";


 export default class Base extends GeneralController {

     decodeRefresh(token: string){
        return jwt.verify(token, REFRESH_SECRETKEY as string)
     }
     decodeToken(token: string) {
       return  jwt.verify(token, VERIFY_SECRETKEY as string)
    }

    isTokenExpired(decoded: any) {
        
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        console.log(currentTimeInSeconds)
        return decoded.exp < currentTimeInSeconds;
    }

    async extractUserDetails(token: string) {
        const payload: any = this.decodeToken(token)

        const tokenExpired = this.isTokenExpired(payload)

        if (!tokenExpired) {
            const pipeline:any[]=[
                {
                    $match: { _id: new mongoose.Types.ObjectId(payload._id )},
                },

                {
                    $lookup: {
                        from: "permission_groups",
                        localField: "permissions",
                        foreignField: "_id",
                        as: "permissionGroups",
                    },
                },

                {
                    $unwind: {
                        path: "$permissionGroups",
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $lookup: {
                        from: "permissions",
                        localField: "permissionGroups.permissions",
                        foreignField: "_id",
                        as: "permissions",
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        firstName: { $first: "$firstName" },
                        lastName: { $first: "$lastName" },
                        email: { $first: "$email" },
                        role: { $first: "$role" },
                        permissions: {
                            $push: "$permissions.method",
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        role:1,
                        permissions: {
                            $reduce: {
                                input: "$permissions",
                                initialValue: [],
                                in: { $concatArrays: ["$$value", "$$this"] }
                            }
                        },
                    },
                },
            ]

            const [userData]: any = await userModel().aggregate(pipeline).exec()

            return userData
        }

        return


    }
 }
