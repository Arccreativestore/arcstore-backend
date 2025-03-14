
import gql from "graphql-tag";

const UserType = gql`
  type Mutation {
    userRegistration(data: iRegister!): User!
    Login(data: ILogin!): AuthToken
    forgotPassword(data: IEmail!): General!
    resetPassword(data: IresetPassword!): General!
    updateUserProfile(data: IupdateProfile): General!
    createOrUpdateWork(data:WorkInput):String
   
  }

  type Query {
    me: String
    verifyAccount(data: IToken): General!
    updatePassword(data: IupdatePassword!): General!
    setPasswordAfter3rdPartyAuth(data: IsetPassword!): General!
    requestEmailVerification(data: IEmail!): General!
    getUserWorkSetting:Work
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
  otp:String!
}

input IupdateProfile {
  email: String
  firstName: String
  lastName: String
  phoneNumber: Int
  profilePicture:String
  banner:String
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
  accessToken: String
  status: String
  message: String
}

# Enums for Job Types and Work Preferences
enum AvailableForHireEnum {
  FULL_TIME
  PART_TIME
  CONTRACT
  FREELANCE
  REMOTE
}

# Input type for Location, used in mutations
input LocationInput {
  country: String!
  state: String
  city: String
}

# Main type for Work data
type Work {
  id: ID!
  userId: ID!
  companyName: String
  position: String
  externalUrl: String
  phoneNumber: String!
  location: Location!
  about: String
  skills: [String!]!
  roleType: AvailableForHireEnum!
  createdAt: String!
  updatedAt: String!
}

# Location type, used within Work type
type Location {
  country: String!
  state: String
  city: String
}

# Input type for adding or updating Work details
input WorkInput {
  companyName: String
  position: String
  externalUrl: String
  phoneNumber: String!
  location: LocationInput!
  about: String
  skills: [String!]!
  roleType: AvailableForHireEnum!
}
`;

export default UserType;
