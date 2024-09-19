import gql from "graphql-tag";

const supportTypeDefs = gql`
type Query {
    getAllFaqs: [IgetFaqs]!
    getOneFaq(data: IgetOneFaq!): IgetFaqs!
}

type Mutation {
    createFaq(data: IcreateFaqs!): IgetFaqs!
    updateFaq(data: IupdateFaqs!): General!
    deleteFaq(data: IdeleteFaqs!): General!
}

type IgetFaqs {
_id: ID!
author: ID!
name: String!
question: String!
answer: String!
category: [ID]!
tags: [String]!
helpful: Int!
notHelpful: Int!
related: [ID]!
status: Boolean!
createdAt: Date!
updatedAt: Date!
}

type General {
    status: String!
    message: String!
}

input IcreateFaqs {
question: String!
answer: String!
category: [ID]!
tags: [String]!
helpful: Int!
notHelpful: Int!
related: [ID]!
status: Boolean!
}


input IupdateFaqs {
faqId: ID!
question: String
answer: String
category: [ID]
tags: [String]
related: [ID]
status: Boolean
}

input IdeleteFaqs {
faqId: ID!
}

input IgetOneFaq {
faqId: ID!
}

`

export default supportTypeDefs