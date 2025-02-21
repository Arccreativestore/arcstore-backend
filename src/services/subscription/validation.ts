import Joi from 'joi';
import { Types } from 'mongoose';
import { Decimal128 } from 'mongodb';
import { ErrorHandlers } from '../../helpers/errorHandler';

// Plan Enums
export enum IUnitType {
    month = 'month',
    year = 'year'
}

export enum subPlans {
    freemium = 'individual',
    premium = 'team',
}

// Plan Interfaces
export interface IPlanValidation {
    type: subPlans;
    amount: Decimal128;
    discount: number;
    disable?: boolean;
    unit: IUnitType;
    duration: number;
    features?: Types.ObjectId[];
}

export interface IUpdatePlanValidation {
    planId: Types.ObjectId;
    type?: subPlans;
    amount?: Decimal128;
    discount?: number;
    disable?: boolean;
    unit?: IUnitType;
    duration?: number;
    features?: Types.ObjectId[];
}

// Custom ObjectId validation
export const objectId = Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}, 'ObjectId Validation');

// Plan Validation Schema
const planSchema = Joi.object({
    type: Joi.string().valid(...Object.values(subPlans)).messages({
        'any.only': 'Plan type must be either "freemium" or "premium"',
        'any.required': 'Plan type is required',
    }),
    amount: Joi.number().required().messages({
        'number.base': 'Amount must be a number',
        'any.required': 'Amount is required',
    }),
    discount: Joi.number().min(0).max(1).required().messages({
        'number.base': 'Discount must be a number',
        'number.min': 'Discount must be between 0 and 1',
        'number.max': 'Discount must be between 0 and 1',
        'any.required': 'Discount is required',
    }),

    unit: Joi.string().valid(...Object.values(IUnitType)).required().messages({
        'any.only': 'Unit must be either "month" or "year"',
        'any.required': 'Unit is required',
    }),
    duration: Joi.number().required().messages({
        'number.base': 'Duration must be a number',
        'any.required': 'Duration is required',
    }),
    features: Joi.array().items(objectId).messages({
        'array.base': 'Features must be an array of ObjectIds',
        'any.required': 'Features are required',
    }),
});

// Create Plan Validation
export function CreatePlanValidation(data: IPlanValidation): Promise<IPlanValidation> {
    return new Promise((resolve, reject) => {
        const { error, value } = planSchema.validate(data, { abortEarly: false });
        if (error) {
            reject(new ErrorHandlers().ValidationError(`Validation failed: ${error.details.map(x => x.message).join(', ')}`));
        } else {
            resolve(value);
        }
    });
}

// Update Plan Validation Schema
const updatePlanSchema = Joi.object({
    planId: objectId.required().messages({
        'any.invalid': 'Invalid Plan ID',
        'any.required': 'Plan ID is required',
    }),
    type: Joi.string().valid(...Object.values(subPlans)).optional().messages({
        'any.only': 'Plan type must be either "freemium" or "premium"',
    }),
    amount: Joi.number().optional().messages({
        'number.base': 'Amount must be a number',
    }),
    discount: Joi.number().min(0).max(1).optional().messages({
        'number.base': 'Discount must be a number',
        'number.min': 'Discount must be between 0 and 1',
        'number.max': 'Discount must be between 0 and 1',
    }),
    disable: Joi.boolean().optional().messages({
        'boolean.base': 'Disable must be a boolean',
    }),
    unit: Joi.string().valid(...Object.values(IUnitType)).optional().messages({
        'any.only': 'Unit must be either "month" or "year"',
    }),
    duration: Joi.number().optional().messages({
        'number.base': 'Duration must be a number',
    }),
    features: Joi.array().items(objectId).optional().messages({
        'array.base': 'Features must be an array of ObjectIds',
    }),
});

// Update Plan Validation
export function UpdatePlanValidation(data: IUpdatePlanValidation): Promise<IUpdatePlanValidation> {
    return new Promise((resolve, reject) => {
        const { error, value } = updatePlanSchema.validate(data, { abortEarly: false });
        if (error) {
            reject(new ErrorHandlers().ValidationError(`Validation failed: ${error.details.map(x => x.message).join(', ')}`));
        } else {
            resolve(value);
        }
    });
}
