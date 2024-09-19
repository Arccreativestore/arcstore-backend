import Base from "../../base";
import { ErrorHandlers } from "../../helpers/errorHandler";
import faqModel from "../../models/Faq";
import { ObjectId } from 'mongodb'
import { faqCreateInputType, faqUpdateInputType } from "./types";
import { logger } from "../../config/logger";


export class datasource extends Base {

    async getAllFaqs(){
        try {
            const find =  await faqModel().find()
            if(find.length > 0) { const activeFaq = find.filter((faq)=> faq.status == true); return activeFaq}
            return 'Sorry There Are No Faqs At This Time'
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    async getOneFaq(_id: string){
        try {

           const find = await faqModel().findById(new ObjectId(_id))
           if(find){
            if(find.status == false){ return null }
            return find.toObject() 
           }
           return null

        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    async createFaq(data: faqCreateInputType){
       try {
        const create = await faqModel().create(data)
        return create ? create.toObject() : null
       } catch (error) {
        logger.error(error)
        throw error
       }
    }

    async updateFaq(data: faqUpdateInputType){
       try {
        const update = await faqModel().updateOne({ _id: new ObjectId(data.faqId) }, { $set: data })
        return update.matchedCount > 0 ? update : null
       } catch (error) {
        logger.error(error)
        throw error
       }
    }

    async deleteFaq(faqId: string){
        try {
            const deleteFaq = await faqModel().findByIdAndDelete(new ObjectId(faqId))
            return deleteFaq ? deleteFaq.toObject() : null
        } catch (error) {
        logger.error(error)
        throw error
        }
    }

}