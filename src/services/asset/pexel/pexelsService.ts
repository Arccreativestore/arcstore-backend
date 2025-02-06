
import { createClient } from 'pexels';
import {  ISearchParams, PhotosResponse, VideoResponse } from './type';
import { ErrorHandlers } from '../../../helpers/errorHandler';

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
      if (response && response.data) {
        return response.data
      } else {
        throw new Error('No photos found');
      }
    } catch (error) {
      console.error('Error fetching photos from Pexels:', error.message);
      throw new ErrorHandlers().ValidationError('Failed to fetch videos');
    }
  };

}