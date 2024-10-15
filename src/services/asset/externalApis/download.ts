import axios from 'axios'
import { FREEPIK_BASE_URL, FREEPIK_API_KEY } from '../../../config/config'
import { PlatformEnum } from './apiAuthHeader'
import { ErrorHandlers } from '../../../helpers/errorHandler'

export class DownloadService{

    public async downloadFreePikAsset(platform:PlatformEnum, relativePath:string, itemId:string, itemFormat?:string){
        try {
            let url = `${FREEPIK_BASE_URL}${relativePath}/${itemId}/download`
            if(itemFormat){
                 url = `${FREEPIK_BASE_URL}${relativePath}/${itemId}/download/${itemFormat}`  
            }
          const response = await axios.get(url,{headers:{
            'x-freepik-api-key': FREEPIK_API_KEY as string,
          }})
    
         
          if (Array.isArray(response.data.data)) {
            return response.data.data[0];
        }
    
          return response.data.data
        } catch (error) {
        throw new ErrorHandlers().ValidationError(error?.response?.data?.message || "Unable to retrieve download link.")
    
        }
    }
}