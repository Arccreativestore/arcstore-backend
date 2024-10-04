import gql from 'graphql-tag'

const AssetType = gql`

  type Mutation {
    addAsset(data:IAddAssetInput):String!
    addAssetCategory(data:IAddCategoryInput):String!
    updateAssetCategory(data:IUpdateCategoryInput):String!
    enableOrDisableAssetCategory(categoryId:ID! status:Boolean!):String!
    publishOrUnpublishAsset(assetId:ID! publish:Boolean!):String!
    deleteAssetCategory(categoryId:ID!):String!
    deleteAsset(assetId:ID!):String!
    likeAsset(data:assetId!): General!
    unlikeAsset(data:assetId!): General!
    getLikeCount(data:assetId!): Int!

    #CREATORS
    addCreatorsPaymentMethod(input: PaymentMethodInput!): PaymentMethod!
    updateCreatorsPaymentMethod(id: ID!, input: PaymentMethodInput!): PaymentMethod!
    deleteCreatorsPaymentMethod(id: ID!): Boolean!
  }


  type Query {
    getAllCategory:[ICategoryResponse]
    getAssetCategoryById(categoryId:ID!):ICategoryResponse
    getAllAssets(page:Int! limit:Int! search:String):AssetDataResponse
    getAllMyAssets(page:Int! limit:Int! search:String):AssetDataResponse
    getAssetById(assetId:ID!):AssetResponse
    getExternalAsset(platform:PlatformEnum! params:IParams):JSON
    getFreePikAsset(platform:PlatformEnum! params:IParams):JSON
    getFreePikAssetDetails(platform:PlatformEnum! params:IDetailsParams):JSON
    getUploadStatusStatistics:[IUploadStatusStatistics]
    getAssetAnalytics:[AssetAnalytics]

     #CREATORS
    getCreatorsPaymentMethods(userId: ID!): [PaymentMethod!]!
  }


  type AssetAnalytics {
    _id: ID!         
    title: String!   
    downloads: Int! 
    views: Int! 
    ratingsCount: Int! 
    averageRating: Float!
    earnings: Float! 
}

  type IUploadStatusStatistics{
  count:Int
  status:IStatus
  }

input IAddAssetInput{
  title:String!
  description:String!
  price:Float!
  categoryId:ID!
}


  enum IFreePickCategory{
  images
  resources
  icons
  }
  
  input IParams{
  page:Int
  query:String
  limit:Int
  order:IOrder
  category:IFreePickCategory
  }

   input IDetailsParams{
    assetId:String
    category:IFreePickCategory
  }

   enum IOrder{
    asc 
    desc
}
  enum PlatformEnum {
    adobeStock
    pinterest
    behance
    dribble
    freepik
    instagram
    tiktok
    mobbin
    envato
    yandex
  }
  input IAddCategoryInput{
    title:String
    description:String
  }


  enum IStatus{
  pending
  approved
  declined
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


enum PaymentMethodEnum {
    PayPal
    BankTransfer
    PayStack
    GooglePay
}

type PaymentMethod {
    id: ID!
    userId: ID!
    method: PaymentMethodEnum!
    details: JSON!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
}

input PaymentMethodInput {
    method: PaymentMethodEnum!
    details: JSON!
    isActive: Boolean
}
`

export default AssetType
