import gql from "graphql-tag";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import UserSchema from "./services/user/typeDefs.js";




const rootTypeDefs = gql`
<<<<<<< HEAD
=======
  enum gender {
    male
    female
  }
>>>>>>> 3a57ec96355985a393c0cfafc88d7bcca9750a4c

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
