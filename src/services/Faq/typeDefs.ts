import gql from "graphql-tag";
import { GraphQLJSON } from 'graphql-type-json'
const supportTypeDefs = gql`
scalar JSON
type Query {
    getAllFaqs(data: IgetAllFaq): getAllFaqs
    getOneFaq(data: IgetOneFaq!): [IgetFaqs]
    searchFaq(data: ISearchFaq): getAllFaqs
}

type Mutation {
    createFaq(data: IcreateFaqs!): IgetFaqs
    updateFaq(data: IupdateFaqs!): General
    deleteFaq(data: IdeleteFaqs!): General
}

type IgetFaqs {
_id: ID
authorName: String
question: String
answer: String
categories: [String]
tags: [String]
helpful: Int
notHelpful: Int
related: [IgetFaqs]
status: Boolean
createdAt: Date
updatedAt: Date
}
type getAllFaqs {
  data: [IgetFaqs] 
  pageInfo: PageInfo
}

type PageInfo {
  hasNextPage: Boolean
  hasPrevPage: Boolean
  totalPages: Int
  nextPage: Int
  prevPage: Int
  totalDocs: Int
}

input IgetAllFaq{
    limit: Int
    page: Int
}

type General {
    status: String
    message: String
}

input IcreateFaqs {
question: String
answer: String
categories: [String]
tags: [String]
helpful: Int
notHelpful: Int
related: [ID]
status: Boolean
}

input ISearchFaq{
searchKey: String!
limit: Int
page: Int
}
input IupdateFaqs {
faqId: ID
question: String
answer: String
category: [ID]
tags: [String]
related: [ID]
status: Boolean
}

input IdeleteFaqs {
faqId: ID
}

input IgetOneFaq {
faqId: ID
}

`

export default supportTypeDefs