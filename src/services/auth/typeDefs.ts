
import gql from "graphql-tag";

const UserType = gql`
  type Mutation {
    userRegistration(data: iRegister!): User!
    verifyAccount: General!
    requestVerification(data: IEmail!): General!
    Login(data: ILogin!): IToken!
    forgotPassword(data: IEmail!): General!
    resetPassword(data: IresetPassword!): General!
    updateUserProfile(data: IupdateProfile): General!
  }

  type Query {
    me: String
  }

  enum IuserType {
    USER
    CREATOR
    STAFF
    SUPERADMIN
  }

  input iRegister {
    email: String!
    firstName: String!
    lastName: String
    password: String!
    role: IuserType!
  }

  input ILogin {
    email: String!
    password: String!
  }
  
  input IEmail{
  email:String!
  }

  input IresetPassword{
    email: String!
    newPassword: String!
    token:String!
  }

  input IupdateProfile {
  email: String
  firstName: String
  lastName: String
  phoneNumber: Int
  }

  type User {
    status: String!
    _id: ID!
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
  }
`;

export default UserType;
