import Joi from "joi"
import { ObjectId } from "mongoose"
import { ErrorHandlers } from "../../helpers/errorHandler"
import data from "../../types"

export interface faqCreateInputType{
faqId?: string
author?: ObjectId
name?: string
question: string
answer: string
category: ObjectId[]
tags: string[]
helpful: number
notHelpful: number
related: ObjectId[]
status: boolean
}


export interface faqUpdateInputType{
    faqId?: string
    question?: string
    answer?: string
    category?: ObjectId[]
    tags?: string[]
    related?: ObjectId[]
    updatedBy?: ObjectId
    status?: boolean
}
    

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId');

const createFaqSchema = Joi.object({
    question: Joi.string().trim().max(500).required().messages({
      'string.max': 'Question cannot exceed 500 characters',
      'any.required': 'Question is required',
    }),
    answer: Joi.string().trim().max(2000).required().messages({
      'string.max': 'Answer cannot exceed 2000 characters',
      'any.required': 'Answer is required',
    }),
    category: Joi.array().items(objectId).max(10).required().messages({
      'array.max': 'Category cannot have more than 10 items',
      'any.required': 'Category is required',
      'string.pattern.base': 'Each category must be a valid ObjectId',
    }),
    tags: Joi.array().items(Joi.string().trim().max(50)).max(10).required().messages({
      'array.max': 'Tags cannot have more than 10 items',
      'string.max': 'Each tag cannot exceed 50 characters',
      'any.required': 'Tags are required',
    }),
    helpful: Joi.number().integer().min(0).required().messages({
      'number.base': 'Helpful must be a number',
      'number.min': 'Helpful cannot be less than 0',
      'any.required': 'Helpful count is required',
    }),
    notHelpful: Joi.number().integer().min(0).required().messages({
      'number.base': 'Not Helpful must be a number',
      'number.min': 'Not Helpful cannot be less than 0',
      'any.required': 'Not Helpful count is required',
    }),
    related: Joi.array().items(objectId).max(10).optional().messages({
      'array.max': 'Related items cannot have more than 10 items',
      'string.pattern.base': 'Each related item must be a valid ObjectId',
    }),
    status: Joi.boolean().required().messages({
      'boolean.base': 'Status must be a boolean value',
      'any.required': 'Status is required',
    })
  });
  

export const validateCreateFaq = (data: faqCreateInputType) => {
    const { error, value } = createFaqSchema.validate(data, { abortEarly: false });
    if (error) {
      throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }
    return value;
  };


  
const updateFaqSchema = Joi.object({
    faqId: objectId.required().messages({
        'any.required': 'Faqid is required',
        'string.pattern.base': 'Faqid must be a valid ObjectId',
    }),
    question: Joi.string().trim().max(500).messages({
      'string.max': 'Question cannot exceed 500 characters'
    }),
    answer: Joi.string().trim().max(2000).messages({
      'string.max': 'Answer cannot exceed 2000 characters'
    }),
    category: Joi.array().items(objectId).max(10).messages({
      'array.max': 'Category cannot have more than 10 items',
      'string.pattern.base': 'Each category must be a valid ObjectId',
    }),
    tags: Joi.array().items(Joi.string().trim().max(50)).max(10).messages({
      'array.max': 'Tags cannot have more than 10 items',
      'string.max': 'Each tag cannot exceed 50 characters'
    }),
    related: Joi.array().items(objectId).max(10).optional().messages({
      'array.max': 'Related items cannot have more than 10 items',
      'string.pattern.base': 'Each related item must be a valid ObjectId',
    }),
    status: Joi.boolean().messages({
      'boolean.base': 'Status must be a boolean value'
    })
  });
  

  export const validateUpdateFaq = (data: faqUpdateInputType) => {
    const { error, value } = updateFaqSchema.validate(data, { abortEarly: false });
    if (error) {
      throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }
    return value;
  };

  const validateSearchSchema = Joi.object({
    searchKey: Joi.string().trim().required().messages({
        'any.required': 'Faqid is required',
    }),
    limit: Joi.number().messages({
      'number.base': 'The limit must be a number.',
      'number.empty': 'The limit field cannot be empty.',
    }),
    page: Joi.number().messages({
      'number.base': 'The page must be a number.',
      'number.empty': 'The page field cannot be empty.',
    })
    })

  export const vailidateSearchQuery = (data: any) =>{
    const { error, value } = validateSearchSchema.validate(data, {abortEarly: false})
    if (error) {
      throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }
    return value
  }