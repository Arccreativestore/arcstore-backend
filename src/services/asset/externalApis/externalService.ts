import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiAuthHeader, PlatformEnum } from './apiAuthHeader';
import { logger } from '../../../config/logger';
import { FREEPIK_API_KEY, FREEPIK_BASE_URL } from '../../../config/config';
import { errorMonitor } from 'node-cache';

export interface QueryParams {
  query: string;  // Search term
  page?: number;  // Page number for pagination
  limit?: number; // Number of results per page
  order?: string; // Optional order/sort parameter
  category?:string
}

interface CustomHeaders {
  [key: string]: string;
}

export class AssetFetcher {
  private apis: { [key: string]: { baseUrl: string; authHeader: string } } = apiAuthHeader;
  private platform: PlatformEnum;

  constructor(platform: PlatformEnum) {
    this.platform = platform;
  }

  // Centralized method for making API requests
  private async makeRequest(
    platform: PlatformEnum,
    endpoint: string,
    params?: QueryParams,
    customHeaders?: CustomHeaders 
  ): Promise<AxiosResponse | undefined> {
    try {
      const api = this.apis[platform];

      if (!api) {
        throw new Error(`API for platform ${platform} is not configured`);
      }
      let headers 
      if(customHeaders){
        headers = customHeaders
      }else{
        headers={Authorization:api.authHeader}
      }


      headers['Content-Type']="application/json"
      headers.Accept= 'application/json'

      const config: AxiosRequestConfig = {
        url: `${api.baseUrl}/${endpoint}`,
        method: 'GET',
        headers,
        params, 
      };


      const response = await axios(config);
      return response.data
    } catch (error) {
      console.log(JSON.stringify({error}, null, 2))
      logger.error(`Error fetching from ${platform}: ${error}`);
      return undefined;
    }
  }

  // Unified method for fetching assets from any platform
  public async fetchAssets(
    params: QueryParams
  ) {

    switch (this.platform) {
      case PlatformEnum.AdobeStock:
        return this.getAdobeStockAssets(params);
      case PlatformEnum.Pinterest:
        return this.getPinterestAssets(params);
      case PlatformEnum.Behance:
        return this.getBehanceAssets(params);
      case PlatformEnum.Dribble:
        return this.getDribbleAssets(params);
      case PlatformEnum.Freepik:
        return this.getFreepikAssets(params);  // Freepik handled differently
      case PlatformEnum.Instagram:
        return this.getInstagramAssets(params);
      case PlatformEnum.TikTok:
        return this.getTikTokAssets(params);
      case PlatformEnum.Mobbin:
        return this.getMobbinAssets(params);
      case PlatformEnum.Envato:
        return this.getEnvatoAssets(params);
      case PlatformEnum.Yandex:
        return this.getYandexAssets(params);
      default:
        logger.info(`Unsupported platform: ${this.platform}`);
    }
  }

  // Example implementations for each platform (now reusing the makeRequest method)
  private async getAdobeStockAssets(params: QueryParams, customHeaders?: CustomHeaders) {
    return await this.makeRequest(PlatformEnum.AdobeStock, 'search', params, customHeaders);
  }

  private async getPinterestAssets(params: QueryParams, customHeaders?: CustomHeaders) {
    return await this.makeRequest(PlatformEnum.Pinterest, 'pins', params, customHeaders);
  }

  private async getBehanceAssets(params: QueryParams, customHeaders?: CustomHeaders) {
    return await this.makeRequest(PlatformEnum.Behance, 'projects', params, customHeaders);
  }

  private async getDribbleAssets(params: QueryParams, customHeaders?: CustomHeaders) {
    return await this.makeRequest(PlatformEnum.Dribble, 'shots', params, customHeaders);
  }

  private async getFreepikAssets(params: QueryParams) {
    const {category, ...rest} = params

    const customHeaders = {
      'x-freepik-api-key': FREEPIK_API_KEY as string,
    }
    return await this.makeRequest(PlatformEnum.Freepik, category as string, rest, customHeaders);
  }

  private async getInstagramAssets(params: QueryParams, ) {
    return await this.makeRequest(PlatformEnum.Instagram, 'media', params);
  }

  private async getTikTokAssets(params: QueryParams) {
    return await this.makeRequest(PlatformEnum.TikTok, 'videos', params);
  }

  private async getMobbinAssets(params: QueryParams) {
    return await this.makeRequest(PlatformEnum.Mobbin, 'assets', params, );
  }

  private async getEnvatoAssets(params: QueryParams) {
    return await this.makeRequest(PlatformEnum.Envato, 'search', params);
  }

  private async getYandexAssets(params: QueryParams ) {
    return await this.makeRequest(PlatformEnum.Yandex, 'search', params);
  }
}

