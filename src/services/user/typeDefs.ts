import gql from "graphql-tag";

const UserType = gql`
  type Mutation {
    userRegistration(data: iRegInput): User!
    verifyAccount: verification!
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
    email: String!
    username: String!
    password: String!
    role: IuserType!
  }

  type User {
    status: String
    _id: String!
    email: String
    username: String
    role: String
  }
  
  type verification{
    status: String
  }
`;

export default UserType;
