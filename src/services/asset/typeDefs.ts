import gql from "graphql-tag";

const AssetType = gql`

  type Mutation {
    addAssetCategory(data:IAddCategoryInput):String!
    updateAssetCategory(data:IUpdateCategoryInput):String!
    enableOrDisableAssetCategory(categoryId:ID! status:Boolean!):String!
    publishOrUnpublishAsset(assetId:ID! publish:Boolean!):String!
    deleteAssetCategory(categoryId:ID!):String!
    deleteAsset(assetId:ID!):String!
    likeAsset(data:assetId!): General!
    unlikeAsset(data:assetId!): General!
    getLikeCount(data:assetId!): Int!
    assetComment(data: Icomment!): Comment!
    deleteComment(data: IdeleteComment!): General!
  }

  type Query {
    getAllCategory:[ICategoryResponse]
    getAssetCategoryById(categoryId:ID!):ICategoryResponse
    getAllAssets(page:Int! limit:Int! search:String):AssetDataResponse
    getAllMyAssets(page:Int! limit:Int! search:String):AssetDataResponse
    getAssetById(assetId:ID!):AssetResponse
  }

  input IAddCategoryInput{
    title:String
    description:String
  }

  input Icomment {
    assetId: String, 
    comment: String
  }

  input IdeleteComment {
    assetId: String, 
    commentId: String
  }
  input IUpdateCategoryInput{
    categoryId:ID!
    title:String
    description:String
  }

  type ICategoryResponse{
    _id:ID
    title:String
    slug:String
    description:String
    createdAt:DateTime
    updatedAt:DateTime
  }

  type Rating {
  count: Int
  total: Int
}
type Comment {
  assetId: ID
  userId: ID
  comment: String
  createdAt:DateTime
  updatedAt:DateTime

}
type IFile {
  _id: ID!
  key: String
  uploadFor: String
  userId: ID
  type: String
  uploaded: Boolean
  createdAt: String
  updatedAt: String
}

type General {
  status: String
  message: String
}

type AssetResponse {
  _id: ID!
  title: String
  description: String
  createdAt: String
  price: Float
  author: ID
  tags: [String]
  views: Int
  downloads: Int
  ratings: Rating
  licenseType: String
  files: [IFile]
  category: ICategoryResponse
}

type PageInfo {
  hasNextPage: Boolean
  hasPrevPage: Boolean
  totalPages: Int
  nextPage: Int
  prevPage: Int
  totalDocs: Int
}

input assetId {
  assetId: ID
}
type AssetDataResponse {
  data: [AssetResponse]
  pageInfo: PageInfo
}
`;

export default AssetType;
