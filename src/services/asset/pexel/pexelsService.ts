
import { createClient } from 'pexels';
import {  ISearchParams, PhotosResponse, VideoResponse } from './type';
import { ErrorHandlers } from '../../../helpers/errorHandler';
import axios from 'axios'
import { DRIBBLE_API_URL, DRIBBLE_ACCESS_TOKEN } from '../../../config/config';

export class PexelServices {
  private apiKey: string;
  private client: any;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = createClient(this.apiKey);
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
        page:data.page | 1,
          per_page:data.per_page | 10,
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

}