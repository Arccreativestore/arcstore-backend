import Joi from 'joi';
import { Types } from 'mongoose';


export interface IPermissionGroup {
    permissions: Types.ObjectId[]; 
    description: string;
    title: string;
}

export interface IUpdatePermissionGroup {
    permissionGroupId:Types.ObjectId
    permissions: Types.ObjectId[]; 
    description: string;
    title: string;
}


export const objectId = Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'ObjectId Validation');

// Create PG
const permissionGroupSchema = Joi.object({
    permissions: Joi.array()
        .items(objectId.required().messages({
            'any.invalid': 'Invalid Permission ID',
        }))
        .required()
        .messages({
            'array.base': 'Permissions are required',
        }),

    description: Joi.string()
        .required()
        .trim()
        .lowercase()
        .messages({
            'string.empty': 'Description is required',
            'string.base': 'Description must be a string',
        }),

    title: Joi.string()
        .required()
        .lowercase()
        .trim()
        .messages({
            'string.empty': 'Title is required',
            'string.base': 'Title must be a string',
        }),
});



export function CreatePermissionGroupValidation(data: IPermissionGroup): Promise<IPermissionGroup> {
    return new Promise((resolve, reject) => {
        const { error, value } = permissionGroupSchema.validate(data, { abortEarly: false });
        if (error) {
            reject(new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`));
        } else {
            resolve(value);
        }
    });
}


//Update PG
const partialUpdateSchema = Joi.object({
    permissionGroupId: objectId.required().messages({
        'any.invalid': 'Invalid Permission Group ID',
        'any.required': 'Permission Group ID is required'
    }),

    permissions: Joi.array()
        .items(objectId.required().messages({
            'any.invalid': 'Invalid Permission ID',
        }))
        .optional()
        .messages({
            'array.base': 'Permissions should be an array of valid Permission IDs',
        }),

    description: Joi.string()
        .trim()
        .lowercase()
        .optional()
        .messages({
            'string.base': 'Description must be a string',
        }),

    title: Joi.string()
        .lowercase()
        .trim()
        .optional()
        .messages({
            'string.base': 'Title must be a string',
        }),
});

export function UpdatePermissionGroupValidation(data:IUpdatePermissionGroup ): Promise<IPermissionGroup> {    
    return new Promise((resolve, reject) => {
        const { error, value } =     partialUpdateSchema .validate(data, { abortEarly: false });
        if (error) {
            reject(new Error(`Validation failed: ${error.details.map(x => x.message).join(', ')}`));
        } else {
            resolve(value);
        }
    });
}
