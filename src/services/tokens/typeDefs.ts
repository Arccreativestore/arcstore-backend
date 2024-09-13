import gql from "graphql-tag"
export const refreshTokenTypeDef = gql`
type Mutation{
    generateToken(data: Token!): Itoken!
}
type Query {
    Me: String!
}
    input Token{
        refreshToken: String!
    }

    type Itoken{
        accessToken: String!
    }
`
