// types.ts

export interface PhotosResponse{
total_results:number
per_page:number
page:number
photos:Photo[]
next_page:string
}

export interface VideoResponse{
    total_results:number
    per_page:number
    page:number
    videos:Videos[]
    next_page:string
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

  export enum BehanceCategory {
    ADVERTISING = "advertising",
    ANIMATION = "animation",
    ARCHITECTURE = "architecture",
    ART_DIRECTION = "art-direction",
    BRANDING = "branding",
    CALLIGRAPHY = "calligraphy",
    CREATIVE_DIRECTION = "creative-direction",
    DIGITAL_ART = "digital-art",
    EDITORIAL_DESIGN = "editorial-design",
    FASHION = "fashion",
    FILM = "film",
    FINE_ARTS = "fine-arts",
    GAME_DESIGN = "game-design",
    GRAPHIC_DESIGN = "graphic-design",
    ILLUSTRATION = "illustration",
    INDUSTRIAL_DESIGN = "industrial-design",
    INTERACTION_DESIGN = "interaction-design",
    INTERIOR_DESIGN = "interior-design",
    MOTION_GRAPHICS = "motion-graphics",
    MUSIC = "music",
    PACKAGING = "packaging",
    PHOTOGRAPHY = "photography",
    PRODUCT_DESIGN = "product-design",
    PROGRAMMING = "programming",
    TYPOGRAPHY = "typography",
    UI_UX = "ui-ux",
    WEB_DESIGN = "web-design",
  }
  
  export interface ISearchParams{
    query?:string
    category?:BehanceCategory
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
  
  export interface Videos {
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

  