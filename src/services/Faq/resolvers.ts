import { isValidObjectId } from "mongoose";
import { User } from "../../app";
import { ErrorHandlers } from "../../helpers/errorHandler";
import { isUserAuthorized } from "../../helpers/utils/permissionChecks";
import { faqCreateInputType,  faqUpdateInputType, validateCreateFaq, validateUpdateFaq } from "./types";
import { datasource } from "./datasource";



const faqQuery = {
    async getAllFaqs(_: any, args: any, context: {user: User}){
    try {
      return await new datasource().getAllFaqs()
    } catch (error) {
       throw error 
    }
    },

    async getOneFaq(__: any, {data}: {data: {faqId: string}}, context: {user: User}){
       try {
         const { faqId } = data
         if(!isValidObjectId(faqId)) throw new ErrorHandlers().ValidationError("faqId is not a valid id")
         const getFaq =  await new datasource().getOneFaq(faqId)
         if(!getFaq) throw new ErrorHandlers().NotFound("Faq not found")
         return getFaq
       } catch (error) {
        throw error
       }
        
    }
}



const faqMutation = {
    async createFaq(_:any, {data}: {data: faqCreateInputType}, context: {user: User}){
      try {

      const userId = context?.user?._id
      if(!userId || !context.user) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
      const { firstName } = context?.user
      validateCreateFaq(data)
      const faqData = {author: userId, name: firstName, ...data }
      isUserAuthorized(context.user, this.createFaq.name)
      return await new datasource().createFaq(faqData)

   } catch (error) {
    throw error
   }
    },

    async updateFaq(_:any, {data}: {data: faqUpdateInputType}, context: {user: User}){
       try {
        //  implement updatedBy 
        const userId = context?.user?._id
        if(!userId || !context.user) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
        validateUpdateFaq(data)
        const {faqId} = data
        if(!isValidObjectId(faqId)) throw new ErrorHandlers().ValidationError("FaqId is not a valid Id")
        isUserAuthorized(context.user, this.updateFaq.name)
        const faqData = { updatedBy: userId, ...data}
        const updateFaq =  await new datasource().updateFaq(faqData)
        if(!updateFaq) throw new ErrorHandlers().NotFound('Could not Update Faq, Possibly does not Exist')
        return { status: "success", message: "Faq Updated Successfully" }
       } catch (error) {
        throw error
       }
    },
    

    async deleteFaq(_:any, {data}: {data: {faqId: string}}, context: {user: User}){
       try {

        const userId = context?.user?._id
        if(!userId || !context.user) throw new ErrorHandlers().AuthenticationError('Please Login to Proceed')
        isUserAuthorized(context.user, this.deleteFaq.name)
        const {faqId} = data
        if(!isValidObjectId(faqId)) throw new ErrorHandlers().ValidationError("FaqId is not a valid Id")
        const deleteFaq =  await new datasource().deleteFaq(faqId)
        if(!deleteFaq) throw new ErrorHandlers().NotFound('Resource not found')
        return { status: "success", message: "Faq Deleted Successfully"}
       } catch (error) {
        throw error
       }
    }
    
}

export const faqMutations = {
    ...faqMutation
}

export const faqQueries = {
    ...faqQuery
}
