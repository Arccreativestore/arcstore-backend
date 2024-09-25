import Joi from "joi";
import { ErrorHandlers } from "../../helpers/errorHandler";

const vailidateNotififcatonsSchema = Joi.object({
    limit: Joi.number().messages({
      'number.base': 'The limit must be a number.',
      'number.empty': 'The limit field cannot be empty.',
    }),
    page: Joi.number().messages({
      'number.base': 'The page must be a number.',
      'number.empty': 'The page field cannot be empty.',
    })
    })

  export const vailidatNotiInput = (data: any) =>{
  const { error, value } = vailidateNotififcatonsSchema.validate(data, {abortEarly: false})
  if (error) {
    throw new ErrorHandlers().ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }
  return value
  }