import gql from "graphql-tag";
import { GraphQLJSON } from 'graphql-type-json'
const UserTypeDefs = gql`
scalar JSON
type Query{
    getDownloads:AssetsResponse
    getsavedAssets:AssetsResponse
    getPurchaseHistory:purchaseHistoryResponse
    getSubcriptionHistory: subHistoryResponse
    disableUserAccount: General
    deleteUserAccount: General
    getUserProfile: getUserProfile!
    saveAsset(data: IsaveAsset): General!
    unsaveAsset(data: IsaveAsset): General!
    getUserCurrentLocation:JSON
    amountUSDToLocalCurrency(amountInUSD:Float):JSON
}



type AssetsResponse {
data: [IResponse]
pageInfo: PageInfo
}

type IResponse{
asset: subAssets
category: subCategory
files: [subFile]
createdAt: Date
}

input IsaveAsset {
assetId: String
}

type subHistoryResponse {
    userId: ID
    plan: String
    amountPayed: Int
    duration: Date
    expiresAt: Date
    paymentMethod: JSON
}

type purchaseHistoryResponse{
_id: ID
userId: ID
assetId: ID
createdAt: String
purchaseDate: Date
amountPayed: Int
paymentMethod: JSON
currency: String
status: Boolean
}

type General {
    status: String
    message: String
}

type getUserProfile {
_id: ID
firstName: String
lastName: String
emailVerified: Boolean
email: String
verifiedDate: Date
role: String
phoneNumber: String
banner:String
profilePicture:String
}

type subAssets{
title: String
description: String
price: Int
author: ID
ratings: String
licenseType: String          
}

type subFile{
    thumbnailUrl: String,
    type: String,
    key: String
}

type subCategory{
    title:String
    description:String
    disable: Boolean
    deleted: Boolean          
}

type PageInfo {
  hasNextPage: Boolean
  hasPrevPage: Boolean
  totalPages: Int
  nextPage: Int
  prevPage: Int
  totalDocs: Int
}
`


export default UserTypeDefs