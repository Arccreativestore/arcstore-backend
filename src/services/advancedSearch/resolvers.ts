import { Request, Response } from "express";
import { Iadvancedsearch } from "./types";
import AdvancedSearchDatasource from "./datasource";
import { NotFoundError } from "../../api/errorClass";
import { ErrorHandlers } from "../../helpers/errorHandler";




interface Icontext {
    res: Response
    req: Request
}


const advanceSearchResolver = {

    async advancedSearch(__: unknown, {data}: {data: Iadvancedsearch}, context: Icontext ){
       
      const args = data.query;
      console.log(args)
        const limit = data.options.limit ? data.options.limit : 20
        const page = data.options.page ? data.options.page : 1

        const search = await new AdvancedSearchDatasource().searchAssets(args, {limit, page})
        if(!search) throw new ErrorHandlers().NotFound('No assets found')
        return search

        
    }
} 


export default advanceSearchResolver;