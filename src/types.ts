import gql from "graphql-tag";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import UserSchema from "./services/user/typeDefs.js";




const rootTypeDefs = gql`
  enum gender {
    male
    female
  }

  type Mutation {
    _: Boolean
  }

  type Query {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;
const data = [
  rootTypeDefs,
  UserSchema,

  ...scalarTypeDefs,
]

export default data;
