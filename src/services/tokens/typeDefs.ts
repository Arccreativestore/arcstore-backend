import gql from "graphql-tag"
export const refreshTokenTypeDef = gql`
type Mutation{
    generateToken: Itoken!
}
type Query {
    Me: String!
}
    type Itoken{
        accessToken: String!
    }
`
