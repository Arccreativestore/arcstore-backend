import { userMutations, UserQuery} from "./services/user/resolver";
import { tokenMutation, tokenQuery } from "./services/tokens/resolvers";
import {
  PermissionMutation,
  PermissionQuery,
} from "./services/permission/resolver";

const Mutation = {
  ...userMutations,
  ...PermissionMutation,
  ...tokenMutation
};

const Query = {
  ...UserQuery,
  ...PermissionQuery,
  ...tokenQuery
};

export { Mutation, Query };
