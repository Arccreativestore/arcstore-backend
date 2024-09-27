import gql from "graphql-tag";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import UserSchema from "./services/auth/typeDefs.js";
import PermissionSchema from "./services/permission/typeDefs.js";
import {refreshTokenTypeDef} from './services/tokens/typeDefs.js'
import UserTypeDefs from "./services/users/typeDefs.js";
import supportTypeDefs from "./services/Faq/typeDefs.js";
import AssetType from "./services/asset/typeDefs.js";
import SubscriptionType from "./services/subscription/typeDefs.js";



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
  refreshTokenTypeDef,
  UserTypeDefs,
  supportTypeDefs,
  AssetType,
  SubscriptionType,
  ...scalarTypeDefs,
]

export default data;
 //"849778890592449"
 //"75965e614ce3f6bfcfff94bbabbd3b5e"