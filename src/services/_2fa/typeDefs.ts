import gql from "graphql-tag";

const typeDefs = gql`
type Mutation {
 enable2fa: General!
}
 
type Query {
 check_2faOtp(data: I2fa): Token!
}

input I2fa {
email: String
otp: Int
}

type Token {
accessToken: String!
}

type General {
status: String
message: String
}
`


export default typeDefs