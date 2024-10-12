
import gql from "graphql-tag";

const UserType = gql`
  type Mutation {
    userRegistration(data: iRegister!): User!
    Login(data: ILogin!): AuthToken!
    forgotPassword(data: IEmail!): General!
    resetPassword(data: IresetPassword!): General!
    updateUserProfile(data: IupdateProfile): General!
   
  }

  type Query {
    me: String
    verifyAccount(data: IToken): General!
    updatePassword(data: IupdatePassword!): General!
    setPasswordAfter3rdPartyAuth(data: IsetPassword!): General!
    requestEmailVerification(data: IEmail!): General!
  }

enum IuserType {
   USER
}

input iRegister {
  email: String!
  firstName: String!
  lastName: String
  password: String!
  role: IuserType!
}

input IupdatePassword {
  oldPassword: String
  newPassword: String
}

input IsetPassword {
  password: String
}

input ILogin {
  email: String!
  password: String!
}
  
input IEmail{
  email:String!
}

input IToken {
  token: String 
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

type AuthToken {
  accessToken: String!
}
`;

export default UserType;
