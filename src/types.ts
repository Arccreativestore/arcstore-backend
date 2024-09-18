import gql from "graphql-tag";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import UserSchema from "./services/user/typeDefs.js";
import PermissionSchema from "./services/permission/typeDefs.js";
import AssetSchema from "./services/asset/typeDefs.js";




const rootTypeDefs = gql`

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
  PermissionSchema,
  AssetSchema,

  ...scalarTypeDefs,
]

export default data;
