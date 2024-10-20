 import GeneralController from "./helpers/generalController";
 import jwt from "jsonwebtoken";
import {userModel} from './models/user'
import mongoose from "mongoose";
import { ACCESS_SECRETKEY, REFRESH_SECRETKEY, VERIFYEMAIL_SECRETKEY } from "./config/config";
import {v4 as uuid} from 'uuid'
import { IUnitType } from "./models/plan";
import moment from "moment";
import { log } from "winston";

 export default class Base extends GeneralController {

     decodeRefresh(token: string){
        return jwt.verify(token, REFRESH_SECRETKEY as string)
     }
     decodeToken(token: string) {
     try{
     return jwt.verify(token, ACCESS_SECRETKEY as string)
 
     }catch(err){
        console.log({err}, "auth error")
        return null

     }
    }

    isTokenExpired(decoded: any) {
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        return decoded?.exp < currentTimeInSeconds;
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


    calculateSubscription(unit: IUnitType, amount: string, discount: number, duration: number): {
		expiresAt: Date,
		totalAmount: number
	} {
		const now = moment();
		let totalAmount: string;
		const newUnit = {
			[IUnitType.month]: 'month',
			[IUnitType.year]: 'year',
		} as const
		
		const endDate = now.clone().add(duration, newUnit[unit]);
		
		if (discount > 0) {
			totalAmount = this.bankersRound(Number(amount) * duration * (1 - discount))
		} else {
			totalAmount = this.bankersRound(Number(amount) * duration)
		}
		return { expiresAt: endDate.toDate(), totalAmount: Number(totalAmount) };
	}
	
	bankersRound(number: number): string {
		// Function to check if a number is exactly halfway between two integers
		const isHalfway = (num: number) => Math.abs(num - Math.round(num)) === 0.5;
		
		let rounded: number;
		if (isHalfway(number)) {
			// If the number is halfway, determine if the integer part is even
			if (Math.floor(number) % 2 === 0) {
				rounded = Math.floor(number);
			} else {
				rounded = Math.ceil(number);
			}
		} else {
			// For non-halfway numbers, use standard rounding and apply two decimal rounding here
			rounded = Math.round(number * 100) / 100;
		}
		
		// Format the rounded number to always have two decimal places
		return rounded.toFixed(2);
	}
	
    generateUniqueId(){ return uuid() }
 }
