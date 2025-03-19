import gql from 'graphql-tag'

const PexelType = gql`

  #type Mutation {
    
  #}

  type Query {
  getPexelsPhotos(data:QueryInput):PhotoResponse
  getPexelsVideos(data:QueryInput):VideoResponse
  getDribbleShots(data:QueryInput):JSON
  getBehanceCategoryProjects(data:QueryInput):JSON
  getBehanceVideo(data:QueryInput):JSON
  aggregatedExternalAssets(data:QueryInput):MediaResponse
}

input QueryInput{
    query:String
    per_page:Int
    page:Int
    category:BehanceCategory
}

enum BehanceCategory {
    ADVERTISING
    ANIMATION
    ARCHITECTURE
    ART_DIRECTION
    BRANDING
    CALLIGRAPHY
    CREATIVE_DIRECTION
    DIGITAL_ART
    EDITORIAL_DESIGN
    FASHION
    FILM
    FINE_ARTS
    GAME_DESIGN
    GRAPHIC_DESIGN
    ILLUSTRATION
    INDUSTRIAL_DESIGN
    INTERACTION_DESIGN
    INTERIOR_DESIGN
    MOTION_GRAPHICS
    MUSIC
    PACKAGING
    PHOTOGRAPHY
    PRODUCT_DESIGN
    PROGRAMMING
    TYPOGRAPHY
    UI_UX
    WEB_DESIGN
  }

type PhotoResponse{
    total_results: Int
    page: Int
    per_page: Int
    next_page:String
    photos:[Photo]
}
type Photo {
    id: Int
    width: Int
    height: Int
    url: String
    photographer: String
    photographer_url: String
    photographer_id: Int
    avg_color: String
    src:SRC
    liked: Boolean
    alt: String
  }

  type SRC  {
      original: String
      large2x: String
      large: String
      medium: String
      small: String
      portrait: String
      landscape: String
      tiny: String
    }


type VideoFile {
  id: Int
  quality: String
  file_type: String
  width: Int
  height: Int
  fps: Float
  link: String
}

type VideoPicture {
  id: Int
  picture: String
  nr: Int
}


type VideoResponse{
total_results: Int
  page: Int
  per_page: Int
  videos:[Video]
  next_page:String
}
type Video {
  id: Int
  width: Int
  height: Int
  url: String
  image: String
  full_res: String   
  tags: [String]  
  duration: Int
  user: Author
  video_files: [VideoFile]
  video_pictures: [VideoPicture]
}


type MediaResponse {
  photos: [Photo]
  videos: [Video]
  icons: [Icon]
  pagination: Pagination
}

type Photo {
  id: Int
  source: String
  url: String
  author: Author
  dimensions: Dimensions
  avg_color: String
  src: SRC
  liked: Boolean
  alt: String
}

type Video {
  id: Int
  source: String
  url: String
  user: Author
  dimensions: Dimensions
  duration: Int
  video_files: [VideoFile]
  thumbnail: String
}

type Icon {
  id: Int
  source: String
  author: Author
  family: IconFamily
  free_svg: Boolean
  tags: [Tag]
  style: IconStyle
  thumbnails: [Thumbnail]
}

type Author {
  name: String
  url: String
}

type Dimensions {
  width: Int
  height: Int
}


type IconFamily {
  id: Int
  name: String
  total: Int
}

type Tag {
  slug: String
  name: String
}

type IconStyle {
  id: Int
  name: String
}

type Thumbnail {
  width: Int
  height: Int
  url: String
}

type Pagination {
  pexels: PageInfoTwo
  freepick: PageInfoTwo
  total_results: TotalResults
}

type PageInfoTwo {
  page: Int
  per_page: Int
  total: Int
}

type TotalResults {
  photos: Int
  videos: Int
  icons: Int
}

`





export default PexelType
