
import { createClient } from 'pexels';
import {  ISearchParams, PhotosResponse, VideoResponse } from './type';
import { ErrorHandlers } from '../../../helpers/errorHandler';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { DRIBBLE_API_URL, DRIBBLE_ACCESS_TOKEN, BEHANCE_BASE_URL, FREEPIK_API_KEY, FREEPIK_BASE_URL } from '../../../config/config';
import {  } from '../../../config/config';

export class PexelServices {
  private apiKey: string;
  private client: any;
  private behanceAPIKey:string

  constructor(apiKey: string, behanceAPIKey?:string) {
    this.apiKey = apiKey;
    this.client = createClient(this.apiKey);
    this.behanceAPIKey = behanceAPIKey
  }

  getPexelsPhotos = async (data:ISearchParams): Promise<PhotosResponse> => {
    try {
      const response = await this.client.photos.search(data);  
        return response
    } catch (error) {
      console.error('Error fetching photos from Pexels:', error.message);
      throw new ErrorHandlers().ValidationError('Failed to fetch photos');
    }
  };

  getPexelsVideos =async (data:ISearchParams): Promise<VideoResponse> => {
    try {
      const response = await this.client.videos.search(data)
        return response
  
    } catch (error) {
      console.error('Error fetching photos from Pexels:', error.message);
      throw new ErrorHandlers().ValidationError('Failed to fetch videos');
    }
  };

getDribbbleShots= async(data:ISearchParams) =>{

    try {
      const response = await axios.get(`${DRIBBLE_API_URL}/v2/user/projects`, {
        headers: {
          Authorization: `Bearer ${DRIBBLE_ACCESS_TOKEN}`,
        },
        params: {
        page:data.page || 1,
          per_page:data.per_page || 10,
        },
      });
  
      console.log("Dribbble Assets:", response);
      return response.data
    } catch (error) {
      console.log({error})
        console.log("Error fetching Dribbble assets:", error.response?.data || error.message)
      throw new ErrorHandlers().ValidationError("Error fetching Dribbble assets:", error.response?.data || error.message);
    }
  }


getBehanceCategoryProjects = async (queryParams:ISearchParams) => {
  try {
    const response = await axios.get(BEHANCE_BASE_URL, {
      params: {
        q: queryParams.query || "logo",           // Search query (e.g., "logo", "UI design")
        field: queryParams.category,      // Filter by category (e.g., "graphic-design")
        page: queryParams.page || 1,         // Pagination: Page number
        per_page: queryParams.per_page || 10,  // Number of results per page
        api_key: this.behanceAPIKey,
      },
    });

    console.log(response.data.projects); // Logs the projects
    return response.data.projects;
  } catch (error) {
    console.error("Error fetching Behance projects:", error);
    return [];
  }

};

getFreePickAssets = async (queryParams: ISearchParams, endpoint: string) => {
  try {
    const headers = { 
      "x-freepik-api-key": FREEPIK_API_KEY as string,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const config: AxiosRequestConfig = {
      url: `${FREEPIK_BASE_URL}${endpoint}`,
      method: "GET",
      headers,
      params: {  
        query: queryParams.query,
        page: queryParams.page || 1,
        per_page: queryParams.per_page || 10,
      },
    };

    const response: AxiosResponse<any> = await axios(config);
  
    return response.data || {}; 
  } catch (error) {
    console.error("Error fetching Freepik assets:", error);
    return {}; 
  }
};

}