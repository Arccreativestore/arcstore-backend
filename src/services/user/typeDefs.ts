
import gql from "graphql-tag";

const UserType = gql`
scalar EmailAddress

  type Mutation {
    userRegistration(data: iRegInput!): User!
    verifyAccount: General!
    requestVerification(data: Email!): General!
    Login(data: LoginInput!): Token!
    forgotPassword(data: Email!): General!
    resetPassword(data: IresetPassword!): General!
  }

  type Query {
    getUserProfile: String
  }
  enum IuserType {
    USER
    CREATOR
    SUPERADMIN
    STAFF
  }

  input iRegInput {
    email: EmailAddress!
    firstName: String!
    lastName: String
    password: String!
    role: IuserType!
  }
  input LoginInput {
    email: String!
    password: String!
  }
  input IresetPassword{
    email: EmailAddress!
    newPassword: String!
    token:String!
  }

  input Email{
  email:String!
  }

  type User {
    status: String!
    _id: String!
    email: EmailAddress!
    firstName: String!
    lastName: String
    role: String!
  }

  type General {
    status: String!
    message: String!
  }
  type Token {
    token: String
  }
`;

export default UserType;
