import Base from '../../../base'
import { BEHANCE_API_KEY, PEXEL_API_KEY } from '../../../config/config'
import { ValidateQueryParams } from '../validation'
import { PexelServices } from './pexelsService'
import { ISearchParams, PhotosResponse,  VideoResponse } from './type'


class PexelsDatasource extends Base {

async getPexelPhotos(data:ISearchParams):Promise<PhotosResponse>{
    // await ValidateQueryParams(data)
    return await new PexelServices(PEXEL_API_KEY as string).getPexelsPhotos(data)
}

async getPexelVideos(data:ISearchParams):Promise<VideoResponse>{
    // await ValidateQueryParams(data)
    return await new PexelServices(PEXEL_API_KEY as string).getPexelsVideos(data)
}

async getDribbleShots(data:ISearchParams):Promise<any>{
    // await ValidateQueryParams(data)
    return await new PexelServices(PEXEL_API_KEY as string).getDribbbleShots(data)
}

async getBehanceCategoryProjects(data:ISearchParams):Promise<any>{
    // await ValidateQueryParams(data)
    return await new PexelServices('', BEHANCE_API_KEY as string).getBehanceCategoryProjects(data)
}

}
export default PexelsDatasource

