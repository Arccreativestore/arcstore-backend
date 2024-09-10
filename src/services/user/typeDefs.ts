import gql from "graphql-tag";

const UserType = gql`
  type Mutation {
    userRegistration(data: iRegInput): User!
    verifyAccount: Verification!
    Login(data: LoginInput): Token!
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
  input LoginInput {
    email: String
    password: String
  }

  type User {
    status: String
    _id: String!
    email: String
    username: String
    role: String
  }

  type Verification {
    status: String
  }
  type Token {
    token: String
  }
`;

export default UserType;
