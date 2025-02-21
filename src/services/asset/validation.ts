import Joi from 'joi';
import { Types } from 'mongoose';
import { ErrorHandlers } from '../../helpers/errorHandler';
import { BehanceCategory, ISearchParams } from './pexel/type';

// Category Interfaces
export interface ICategoryValidation {
    title: string;
    description: string;
}

export interface IUpdateCategoryValidation {
    categoryId: string;
    title?: string;
    description?: string;
}



export interface IQueryParamsValidation {
    category?: string;
    page?: number;
    per_page?: number;
    query:string
}


// Custom ObjectId validation
export const objectId = Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'ObjectId Validation');


// Category Validation Schema
const categorySchema = Joi.object({
    title: Joi.string().required().trim().messages({
        'string.empty': 'Title is required',
        'string.base': 'Title must be a string',
    }),
    description: Joi.string().required().trim().messages({
        'string.empty': 'Description is required',
        'string.base': 'Description must be a string',
    }),
});


// Create Category Validation
export function CreateCategoryValidation(data: ICategoryValidation): Promise<ICategoryValidation> {
    return new Promise((resolve, reject) => {
        const { error, value } = categorySchema.validate(data, { abortEarly: false });
        if (error) {
            reject(new ErrorHandlers().ValidationError(`Validation failed: ${error.details.map(x => x.message).join(', ')}`));
        } else {
            resolve(value);
        }
    });
}

// Update Category Validation Schema
const updateCategorySchema = Joi.object({
    categoryId: objectId.required().messages({
        'any.invalid': 'Invalid Category ID',
        'any.required': 'Category ID is required',
    }),
    title: Joi.string().trim().optional().messages({
        'string.base': 'Title must be a string',
    }),
    description: Joi.string().trim().optional().messages({
        'string.base': 'Description must be a string',
    }),
});

// Update Category Validation
export function UpdateCategoryValidation(data: IUpdateCategoryValidation): Promise<IUpdateCategoryValidation> {
    return new Promise((resolve, reject) => {
        const { error, value } = updateCategorySchema.validate(data, { abortEarly: false });
        if (error) {
            reject(new ErrorHandlers().ValidationError(`Validation failed: ${error.details.map(x => x.message).join(', ')}`));
        } else {
            resolve(value);
        }
    });
}



// Asset Interfaces
export interface IAssetValidation {
    title: string;
    description: string;
    price: number;
    authorId: string
    categoryId: string
    tags:string[]
}

export interface IUpdateAssetValidation {
    assetId: string;
    title?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    tags?: string[];
    licenseType?: 'regular' | 'extended';
}


// Asset Validation Schema
const assetSchema = Joi.object({
    title: Joi.string().required().trim().messages({
        'string.empty': 'Title is required',
        'string.base': 'Title must be a string',
    }),
    description: Joi.string().required().trim().messages({
        'string.empty': 'Description is required',
        'string.base': 'Description must be a string',
    }),
    price: Joi.number().required().messages({
        'number.base': 'Price must be a number',
        'any.required': 'Price is required',
    }),
    authorId: objectId.required().messages({
        'any.invalid': 'Invalid Author ID',
        'any.required': 'Author ID is required',
    }),
    categoryId: objectId.required().messages({
        'any.invalid': 'Invalid Category ID',
        'any.required': 'Category ID is required',
    }),
    tags: Joi.array()
    .items(Joi.string().required().messages({
        'string.base': 'Each tag must be a string',
        'any.required': 'Tag is required',
    }))
    .required()
    .messages({
        'array.base': 'Tags must be an array',
        'any.required': 'Tags are required',
    }),
});

// Create Asset Validation
export function CreateAssetValidation(data: IAssetValidation): Promise<IAssetValidation> {
    return new Promise((resolve, reject) => {
        const { error, value } = assetSchema.validate(data, { abortEarly: false });
        if (error) {
            reject(new ErrorHandlers().ValidationError(`Validation failed: ${error.details.map(x => x.message).join(', ')}`));
        } else {
            resolve(value);
        }
    });
}

// Update Asset Validation Schema
const updateAssetSchema = Joi.object({
    assetId: objectId.required().messages({
        'any.invalid': 'Invalid Asset ID',
        'any.required': 'Asset ID is required',
    }),
    title: Joi.string().trim().optional().messages({
        'string.base': 'Title must be a string',
    }),
    description: Joi.string().trim().optional().messages({
        'string.base': 'Description must be a string',
    }),
    price: Joi.number().optional().messages({
        'number.base': 'Price must be a number',
    }),
    category: objectId.optional().messages({
        'any.invalid': 'Invalid Category ID',
    }),
    tags: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Tags should be an array of strings',
    }),
    licenseType: Joi.string().valid('regular', 'extended').optional().messages({
        'any.only': 'License type must be either "regular" or "extended"',
    }),
});

// Update Asset Validation
export function UpdateAssetValidation(data: IUpdateCategoryValidation): Promise<IUpdateCategoryValidation> {
    return new Promise((resolve, reject) => {
        const { error, value } = updateAssetSchema.validate(data, { abortEarly: false });
        if (error) {
            reject(new ErrorHandlers().ValidationError(`Validation failed: ${error.details.map(x => x.message).join(', ')}`));
        } else {
            resolve(value);
        }
    });
}


const searchParamsSchema = Joi.object({
    page:Joi.number(),
    per_page:Joi.number(),
    query:Joi.string(),
    category:Joi.string()

})
export function ValidateQueryParams(data:ISearchParams):Promise<ISearchParams>{
    return new Promise((resolve, reject) => {
        const { error, value } = searchParamsSchema.validate(data, { abortEarly: false });
        if (error) {
            reject(new ErrorHandlers().ValidationError(`Validation failed: ${error.details.map(x => x.message).join(', ')}`));
        } else {
            resolve(value);
        }
    });

}