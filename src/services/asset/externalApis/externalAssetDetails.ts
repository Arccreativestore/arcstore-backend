import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiAuthHeader, PlatformEnum } from './apiAuthHeader';
import { logger } from '../../../config/logger';
import { FREEPIK_API_KEY } from '../../../config/config';

export interface DetailsQueryParams {
  assetId?: string;  // ID of the asset to fetch
  category: string;  // Category under which the asset/file falls
}

interface CustomHeaders {
  [key: string]: string;
}

export class AssetDetailsFetcher {
  private apis: { [key: string]: { baseUrl: string; authHeader: string } } = apiAuthHeader;
  private platform: PlatformEnum;

  constructor(platform: PlatformEnum) {
    this.platform = platform;
  }

  // Centralized method for making API requests
  private async makeRequest(
    platform: PlatformEnum,
    endpoint: string,
    params?: DetailsQueryParams,
    customHeaders?: CustomHeaders
  ): Promise<AxiosResponse | undefined> {
    try {
      const api = this.apis[platform];

      if (!api) {
        throw new Error(`API for platform ${platform} is not configured`);
      }

      const headers = customHeaders ? customHeaders : { Authorization: api.authHeader };
      headers['Content-Type'] = "application/json";
      headers.Accept = 'application/json';

      const config: AxiosRequestConfig = {
        url: `${api.baseUrl}/${endpoint}`,
        method: 'GET',
        headers,
        params,
      };

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.log(JSON.stringify({ error }, null, 2));
      logger.error(`Error fetching from ${platform}: ${error}`);
      return undefined;
    }
  }

  // Method to fetch asset details dynamically based on assetId
  public async fetchAssetDetails(params: DetailsQueryParams): Promise<any> {
    const { assetId, category } = params;

    if (!assetId) {
      throw new Error('assetId must be provided.');
    }

    const endpoint = `${category}/${assetId}`;

    switch (this.platform) {
      case PlatformEnum.AdobeStock:
        return this.getAdobeStockAssetDetails(endpoint, category);
      case PlatformEnum.Pinterest:
        return this.getPinterestAssetDetails(endpoint, category);
      case PlatformEnum.Behance:
        return this.getBehanceAssetDetails(endpoint, category);
      case PlatformEnum.Dribble:
        return this.getDribbleAssetDetails(endpoint, category);
      case PlatformEnum.Freepik:
        return this.getFreepikAssetDetails(endpoint, category); // Freepik handled differently
      case PlatformEnum.Instagram:
        return this.getInstagramAssetDetails(endpoint, category);
      case PlatformEnum.TikTok:
        return this.getTikTokAssetDetails(endpoint, category);
      case PlatformEnum.Mobbin:
        return this.getMobbinAssetDetails(endpoint, category);
      case PlatformEnum.Envato:
        return this.getEnvatoAssetDetails(endpoint, category);
      case PlatformEnum.Yandex:
        return this.getYandexAssetDetails(endpoint, category);
      default:
        logger.info(`Unsupported platform: ${this.platform}`);
    }
  }

  // Example implementations for each platform using the dynamically built URL
  private async getAdobeStockAssetDetails(endpoint: string, category: string, customHeaders?: CustomHeaders) {
    return await this.makeRequest(PlatformEnum.AdobeStock, endpoint, { category }, customHeaders);
  }

  private async getPinterestAssetDetails(endpoint: string, category: string, customHeaders?: CustomHeaders) {
    return await this.makeRequest(PlatformEnum.Pinterest, endpoint, { category }, customHeaders);
  }

  private async getBehanceAssetDetails(endpoint: string, category: string, customHeaders?: CustomHeaders) {
    return await this.makeRequest(PlatformEnum.Behance, endpoint, { category }, customHeaders);
  }

  private async getDribbleAssetDetails(endpoint: string, category: string, customHeaders?: CustomHeaders) {
    return await this.makeRequest(PlatformEnum.Dribble, endpoint, { category }, customHeaders);
  }

  private async getFreepikAssetDetails(endpoint: string, category: string) {
    const customHeaders = {
      'x-freepik-api-key': FREEPIK_API_KEY as string,
    };
    return await this.makeRequest(PlatformEnum.Freepik, endpoint, { category }, customHeaders);
  }

  private async getInstagramAssetDetails(endpoint: string, category: string) {
    return await this.makeRequest(PlatformEnum.Instagram, endpoint, { category });
  }

  private async getTikTokAssetDetails(endpoint: string, category: string) {
    return await this.makeRequest(PlatformEnum.TikTok, endpoint, { category });
  }

  private async getMobbinAssetDetails(endpoint: string, category: string) {
    return await this.makeRequest(PlatformEnum.Mobbin, endpoint, { category });
  }

  private async getEnvatoAssetDetails(endpoint: string, category: string) {
    return await this.makeRequest(PlatformEnum.Envato, endpoint, { category });
  }

  private async getYandexAssetDetails(endpoint: string, category: string) {
    return await this.makeRequest(PlatformEnum.Yandex, endpoint, { category });
  }
}
