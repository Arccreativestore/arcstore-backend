import AssetModel from "../../models/asset";
import { Iadvancedsearch } from "./types";
import { PipelineStage } from "mongoose";


class AdvancedSearchDatasource {

    async searchAssets(data: any, options: { limit: number, page: number}){
        const pipeline: PipelineStage[] = [
            { $match: data },
           
        ];
       
       const result = await AssetModel().aggregatePaginate(
        pipeline, // Pass the pipeline array directly
        options
    );

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
          };

    }

}


export default AdvancedSearchDatasource