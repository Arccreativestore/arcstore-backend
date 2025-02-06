// types.ts

export interface PhotosResponse{
    total_results:number
per_page:number
page:number
photos:Photo[]
}
 interface Photo {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    photographer_id: number;
    avg_color: string;
    src: {
      original: string;
      large2x: string;
      large: string;
      medium: string;
      small: string;
      portrait: string;
      landscape: string;
      tiny: string;
    };
    liked: boolean;
    alt: string;
  }

  export interface ISearchParams{
    query?:string
    per_page:number   
    page:number
}
export interface User {
    id: number;
    name: string;
    url: string;
  }
  
  export interface VideoFile {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    fps: number;
    link: string;
  }
  
  export interface VideoPicture {
    id: number;
    picture: string;
    nr: number;
  }
  
  export interface VideoResponse {
    id: number;
    width: number;
    height: number;
    url: string;
    image: string;
    full_res: string | null; // null is allowed
    tags: string[];          // array of strings
    duration: number;
    user: User;
    video_files: VideoFile[];
    video_pictures: VideoPicture[];
  }

  