import Base from "../../base";
import { ErrorHandlers } from "../../helpers/errorHandler";
import faqModel from "../../models/Faq";
import { ObjectId } from 'mongodb'
import { faqCreateInputType, faqUpdateInputType } from "./types";
import { logger } from "../../config/logger";
import { Mongoose, PipelineStage, Schema } from "mongoose";
import { title } from "process";


export class datasource extends Base {

    async getAllFaqs(page:number=1, limit:number=20){
        try {
            let options = {
                page,
                limit: limit > 100 ? 100:limit,
                $sort:{ createdAt:-1 },
              }
            // add related to pipeline
            const pipeline: PipelineStage[] = [
                {
                  $match: {
                    status: true,
                  },
                },
                {
                  $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categories",
                  },
                },
                {
                  $unwind: {
                    path: "$categories",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $project: {
                    authorName: 1,
                    question: 1,
                    answer: 1,
                    tags: 1,
                    helpful: 1,
                    notHelpful: 1,
                    status: 1,
                    related: 1,
                    updatedBy: 1,
                    categories: {
                      title: 1,
                      slug: 1,
                    },

                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              ];
            
              const faqModelInstance = faqModel();
              const aggregate = faqModelInstance.aggregate(pipeline);
              const result = await faqModelInstance.aggregatePaginate(aggregate as any, options);
              console.log(result)
              return {
                data: result.docs,
                pageInfo: {
                  hasNextPage: result.hasNextPage,
                  hasPrevPage: result.hasPrevPage,
                  totalPages: result.totalPages,
                  nextPage: result.nextPage,
                  prevPage: result.prevPage,
                  totalDocs: result.totalDocs,
                },
            }
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    async searchFaqs(searchKey: string, page?:number, limit?: number){
        try {

            let options = {
                page: page ? page : 1,
                limit: limit ? limit : 20,
                $sort:{ createdAt:-1 },
              }
            console.log(options)
            const pipeline: PipelineStage[] = [
                {
                  $match: {
                    status: true, 
                    ...(searchKey && {
                      $or: [
                        { name: { $regex: searchKey, $options: "i" } }, 
                        { question: { $regex: searchKey, $options: "i" } }, 
                        { tags: { $regex: searchKey, $options: "i" } }, 
                        { answer: { $regex: searchKey, $options: "i" } },
                      ],
                    }),
                  },
                },
                {
                  $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categories",
                  },
                },
                {
                  $unwind: {
                    path: "$categories",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                      from: "faq", 
                      let: { related_ids: "$related" },
                      pipeline: [
                          {
                              $match: {
                                  $expr: { $in: ["$_id", "$$related_ids"] },
                              },
                          },
                          {
                              $project: {
                                  _id: 1,
                                  question: 1,
                                  authorName: 1,
                                  tags: 1,
                                  helpful: 1,
                                  notHelpful: 1,
                                  status: 1,
                                  updatedBy: 1,
                                  createdAt: 1,
                                  updatedAt: 1,
                              },
                          },
                      ],
                      as: "related",
                  },
              },
                {
                  $project: {
                    authorName: 1,
                    question: 1,
                    answer: 1,
                    tags: 1,
                    helpful: 1,
                    notHelpful: 1,
                    related: 1,
                    updatedBy: 1,
                    status: 1,
                    categories: {
                        title: 1,
                        slug: 1,
                        description: 1,
                        disable: 1,
                        deleted: 1,
                      },
                  },
                },
              ];
            
              const faqModelInstance = faqModel();
              const aggregate = faqModelInstance.aggregate(pipeline);
              const result = await faqModelInstance.aggregatePaginate(aggregate as any, options);
            
              return {
                data: result.docs,
                pageInfo: {
                  hasNextPage: result.hasNextPage,
                  hasPrevPage: result.hasPrevPage,
                  totalPages: result.totalPages,
                  nextPage: result.nextPage,
                  prevPage: result.prevPage,
                  totalDocs: result.totalDocs,
                },
              };
            

        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    async getOneFaq(_id: string){

        const pipeline: PipelineStage[] = [
            {
              $match: {
                _id: new ObjectId(_id),
                status: true, 
              },
            },
            {
              $lookup: {
                from: "categories", 
                localField: "category",
                foreignField: "_id",
                as: "categories",
              },
            },
            {
              $unwind: {
                path: "$categories", 
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $lookup: {
                  from: "faq", 
                  let: { related_ids: "$related" },
                  pipeline: [
                      {
                          $match: {
                              $expr: { $in: ["$_id", "$$related_ids"] },
                          },
                      },
                      {
                          $project: {
                              _id: 1,
                              question: 1,
                              authorName: 1,
                              tags: 1,
                              helpful: 1,
                              notHelpful: 1,
                              status: 1,
                              updatedBy: 1,
                              createdAt: 1,
                              updatedAt: 1,
                          },
                      },
                  ],
                  as: "related",
              },
          },
            {
              $project: {
                authorName: 1, 
                question: 1, 
                answer: 1, 
                author: 1,
                tags: 1,
                helpful: 1,
                notHelpful: 1, 
                related: 1, 
                updatedBy: 1, 
                categories: {
                    title: 1,
                    slug: 1,
                    description: 1,
                    disable: 1,
                    deleted: 1,
                },
                status: 1, 
                createdAt: 1,
                updatedAt: 1, 
              },
            },
          ];
        
          const faqModelInstance = faqModel();
          const result = await faqModelInstance.aggregate(pipeline).exec();
         
          return result
          
        
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