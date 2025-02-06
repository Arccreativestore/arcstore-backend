import { User } from "../../../app"
import { isUserAuthorized } from "../../../helpers/utils/permissionChecks"
import PexelsDatasource from "./datasource"
import {  ISearchParams, VideoResponse, PhotosResponse } from "./type"



interface context{
  req:Request, 
  res:Response,
  user:User
  }
export const PexelsMutation = {


}



export const PexelsQuery = {
  
    async getPexelsPhotos(_:unknown, {data}:{data:ISearchParams}, context:context ):Promise<PhotosResponse>{
        // isUserAuthorized(context.user, this.getPexelsPhotos.name)
        return await new PexelsDatasource().getPexelPhotos(data)
      },

     async getPexelsVideos(_:unknown, {data}:{data:ISearchParams}, context:context ):Promise<VideoResponse>{
        // isUserAuthorized(context.user, this.getPexelsVideos.name)
        return await new PexelsDatasource().getPexelVideos(data)
      },
}
  

