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
   

    #CREATORS
    addCreatorsPaymentMethod(input: PaymentMethodInput!): PaymentMethod!
    updateCreatorsPaymentMethod(id: ID!, input: PaymentMethodInput!): PaymentMethod!
    deleteCreatorsPaymentMethod(id: ID!): Boolean!
    assetComment(data: Icomment!): Comment!
    deleteComment(data: IdeleteComment!): General!


    #payment for assets 
    processPayment(planId:ID! paymentMethod:IPaymentMethodEnum):JSON
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
    getDownloadLink(platform:PlatformEnum! assetType:IFreePickCategory! itemId:String! itemFormat:String):DownloadResponse
    getLikeCount(data:assetId!): Int!
    getAssetComment(assetId:ID!):[Comment]
     #CREATORS
    getCreatorsPaymentMethods(userId: ID!): [PaymentMethod!]!
  }

  type DownloadResponse{
  filename:String
  url:String}

  enum IPaymentMethodEnum{
  Paystack
  GooglePay
  }
  enum ItemEnum{
  psd
  ai
  eps
  atn
  fonts
  resources
  png
  jpg
  render
  svg
  mockup 
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

type Icomment {
  assetId: String,
  comment: String
  userId: JSON
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
  likeCounts:Int
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
