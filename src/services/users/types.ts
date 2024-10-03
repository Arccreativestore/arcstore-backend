import { validate } from "graphql"
import Joi from "joi"
import { ObjectId } from "mongoose"
import { ErrorHandlers } from "../../helpers/errorHandler"

export interface downloadType {
    assetId: ObjectId
    userId: ObjectId
}

export interface savedAssetType {
    assetId: ObjectId
    userId: ObjectId
}

export interface purchaseHistoryType  {
    userId: ObjectId
    assetId: Array<ObjectId>
    purchaseDate: Date
    amountPayed: number
    currency: string
    status: boolean
  
}

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId');

const validateObjectSchema = Joi.object({
    _id: objectId.required().messages({
        'any.required': 'please Login to Proceed',
        'string.pattern.base': 'Invalid User Id'
    })
})

export const validateMongoId = (_id: any)=>{
    const {error, value} = validateObjectSchema.validate({_id}, {abortEarly: false})
    if (error) {
        throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }
    return value
}
