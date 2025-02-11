import Base from '../../../base'
import { PEXEL_API_KEY } from '../../../config/config'
import { PexelServices } from './pexelsService'
import { ISearchParams, PhotosResponse,  VideoResponse } from './type'


class PexelsDatasource extends Base {

async getPexelPhotos(data:ISearchParams):Promise<PhotosResponse>{
    return await new PexelServices(PEXEL_API_KEY as string).getPexelsPhotos(data)
}
async getPexelVideos(data:ISearchParams):Promise<VideoResponse>{
    return await new PexelServices(PEXEL_API_KEY as string).getPexelsVideos(data)
}

async getDribbleShots(data:ISearchParams):Promise<any>{
    return await new PexelServices(PEXEL_API_KEY as string).getDribbbleShots(data)
}

}
export default PexelsDatasource

