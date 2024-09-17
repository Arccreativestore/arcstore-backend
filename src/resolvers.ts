import { userMutations, UserQuery } from "./services/user/resolver";
import {
  PermissionMutation,
  PermissionQuery,
} from "./services/permission/resolver";
import { AssetMutation, AssetQuery } from "./services/asset/resolver";

const Mutation = {
  ...userMutations,
  ...PermissionMutation,
  ...AssetMutation,
};

const Query = {
  ...UserQuery,
  ...PermissionQuery,
  ...AssetQuery
};

export { Mutation, Query };
