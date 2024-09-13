
import gql from "graphql-tag";

const UserType = gql`
  type Mutation {
    userRegistration(data: iRegInput!): User!
    verifyAccount: General!
    requestVerification(data: Email!): General!
    Login(data: LoginInput!): IToken!
    forgotPassword(data: Email!): General!
    resetPassword(data: IresetPassword!): General!
  }

  type Query {
    getUserProfile: String
  }

  enum IuserType {
    USER
  }

  input iRegInput {
    email: String!
    firstName: String!
    lastName: String
    password: String!
    role: IuserType!
  }

  input LoginInput {
    email: String!
    password: String!
  }
  
  input Email{
  email:String!
  }

  input IresetPassword{
    email: String!
    newPassword: String!
    token:String!
  }

  type User {
    status: String!
    _id: String!
    email: String!
    firstName: String!
    lastName: String
    role: String!
  }

  type General {
    status: String!
    message: String!
  }

  type IToken {
    accessToken: String!
    refreshToken: String!
  }
`;

export default UserType;
