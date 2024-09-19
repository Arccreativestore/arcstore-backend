import gql from "graphql-tag";
import { GraphQLJSON } from 'graphql-type-json'
const UserTypeDefs = gql`
scalar JSON
type Query{
    getDownloads: downloadsResponse
    getsavedAssets:savedAssetsResponse
    getPurchaseHistory:purchaseHistoryResponse
    getSubcriptionHistory: subHistoryResponse
}

type downloadsResponse{
_id: ID
userId: ID
assetId: ID
createdAt: String
}

type savedAssetsResponse{
_id: ID
userId: ID
assetId: ID
createdAt: String
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
}`

export default UserTypeDefs