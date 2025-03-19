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


async getFreepikAssetDetails(data:ISearchParams, endpoint:string){
    return await new PexelServices(PEXEL_API_KEY as string).getFreePickAssets(data, endpoint )
}


async aggregatedExternalAssets(data: ISearchParams) {
    try {
        const [pexelPhotos, pexelVideos, freePickIcons, freePickPhotos] = await Promise.all([
            this.getPexelPhotos(data),
            this.getPexelVideos(data),
            this.getFreepikAssetDetails(data, 'icons'),
            this.getFreepikAssetDetails(data, 'images'),
        ]);

        // Standardizing photo data
        const photos = [
            ...pexelPhotos.photos.map(photo => ({
                id: photo.id,
                source: "pexels",
                url: photo.url,
                author: {
                    name: photo.photographer,
                    url: photo.photographer_url,
                },
                dimensions: {
                    width: photo.width,
                    height: photo.height,
                },
                avg_color: photo.avg_color,
                src: photo.src,
                liked: photo.liked,
                alt: photo.alt,
            })),
            ...freePickPhotos.data.map((photo: any) => ({
                id: photo.id,
                source: "freepick",
                url: photo.url,
                type: photo.type,
                author: {
                    name: photo.author.name,
                    url: photo.author.avatar,
                },
                dimensions: {
                    width: photo.preview.width,
                    height: photo.preview.height,
                },
                available_formats: photo.available_formats,
                src: photo.preview,
            })),
        ];

        // Standardizing video data
        const videos = pexelVideos.videos.map(video => ({
            id: video.id,
            source: "pexels",
            url: video.url,
            user: {
                name: video.user.name,
                url: video.user.url,
            },
            dimensions: {
                width: video.width,
                height: video.height,
            },
            duration: video.duration,
            video_files: video.video_files.map((file: any) => ({
                id: file.id,
                quality: file.quality,
                file_type: file.file_type,
                width: file.width,
                height: file.height,
                fps: file.fps,
                link: file.link,
                size: file?.size,
            })),
            thumbnail: video.image,
        }));

        // Standardizing icon data
        const icons = freePickIcons.data.map((icon: any) => ({
            id: icon.id,
            source: "freepick",
            url: icon.url,
            type: icon.type,
            author: {
                name: icon.author.name,
                url: icon.author.avatar,
            },
            family: icon.family,
            free_svg: icon.free_svg,
            tags: icon.tags,
            style: icon.style,
            thumbnails: icon.thumbnails,
        }));

        return {
            photos,
            videos,
            icons,
            pagination: {
                pexels: {
                    page: pexelPhotos.page,
                    per_page: pexelPhotos.per_page,
                    total: pexelPhotos.total_results,
                },
                freepick: {
                    page: freePickPhotos?.meta?.pagination?.page || 1,
                    per_page: freePickPhotos?.meta?.pagination?.per_page || freePickPhotos?.data?.length || 0,
                    total: freePickPhotos?.meta?.pagination?.total || freePickPhotos?.data?.length || 0,
                },
                total_results: {
                    photos: photos.length,
                    videos: videos.length,
                    icons: icons.length,
                },
            },
        };
    } catch (error) {
        console.error("Error fetching external assets:", error);
        return {
            photos: [],
            videos: [],
            icons: [],
            pagination: {
                pexels: { page: 1, per_page: 0, total: 0 },
                freepick: { page: 1, per_page: 0, total: 0 },
                total_results: { photos: 0, videos: 0, icons: 0 },
            },
        };
    }
}


}
export default PexelsDatasource

