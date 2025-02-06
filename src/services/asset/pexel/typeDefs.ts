import gql from 'graphql-tag'

const PexelType = gql`

  #type Mutation {
    
  #}

  type Query {
  getPexelsPhotos(data:QueryInput):PhotoResponse
  getPexelsVideos(data:QueryInput):VideoResponse
}

input QueryInput{
query:String
per_page:Int
page:Int
}


type PhotoResponse{
total_results: Int
  page: Int
  per_page: Int
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


type User {
  id: Int!
  name: String!
  url: String!
}

type VideoFile {
  id: Int!
  quality: String!
  file_type: String!
  width: Int!
  height: Int!
  fps: Float!
  link: String!
}

type VideoPicture {
  id: Int!
  picture: String!
  nr: Int!
}

type VideoResponse {
  id: Int!
  width: Int!
  height: Int!
  url: String!
  image: String!
  full_res: String   # nullable field (null allowed)
  tags: [String!]!   # non-null array of non-null strings
  duration: Int!
  user: User!
  video_files: [VideoFile!]!
  video_pictures: [VideoPicture!]!
}

`





export default PexelType
