import Joi from "joi"
import { ErrorHandlers } from "../../helpers/errorHandler"



    export interface Icreator {
        country: string
        city: string
        address: string
        postalCode: string
        phoneNumber: string
        disabled: boolean
    }

    const validateCreatorSchema = Joi.object({
        country: Joi.string().min(4).required().messages({
            'any.required': 'please input a country',
        }),

        city: Joi.string().required().messages({
            'any.required': 'please input a city',
        }),

        address: Joi.string().required().messages({
            'any.required': 'please input an address',
        }),

        postalCode: Joi.string().required().messages({
            'any.required': 'please input a postal code',
        }),

        phoneNumber: Joi.string().required().messages({
            'any.required': 'please input a phone number',
        }),

    })



    export const validateCreator = (data: any)=>{
        const { error, value } = validateCreatorSchema.validate(data, {abortEarly: false})
        if (error) {
            throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
          }
        return value;
    }