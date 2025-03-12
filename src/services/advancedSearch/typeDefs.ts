import gql from "graphql-tag";

const advanceSearchType = gql`

    type Mutation {
        advancedSearch(data: IadvanceSearch): returnAsset!
    }

    input IadvanceSearch {
        query: Iquery
        options: Ioptions
    }

    input Ioptions {
        limit: Int!
        page: Int!
    }

    input Iquery {
        color: String
        size: String
        fileFormat: String
        style: String
        licenseType: String
        dateAdded: String
        popularity: String
        author: String
        tags: [String]
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
        color: String
        size: String
        fileFormat: String
        category: ICategoryResponse
    }

    type ICategoryResponse {
        _id: ID
        title: String
        slug: String
        description: String
        createdAt: DateTime
        updatedAt: DateTime
    }

type PageInfo {
  hasNextPage: Boolean
  hasPrevPage: Boolean
  totalPages: Int
  nextPage: Int
  prevPage: Int
  totalDocs: Int
}

    type returnAsset {
    data: [AssetResponse] 
    pageInfo: PageInfo
    }
`

export default advanceSearchType;