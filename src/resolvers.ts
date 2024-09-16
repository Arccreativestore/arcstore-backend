import { authMutations, UserQuery} from "./services/auth/resolver";
import { tokenMutation, tokenQuery } from "./services/tokens/resolvers";
import {
  PermissionMutation,
  PermissionQuery,
} from "./services/permission/resolver";

const Mutation = {
  ...authMutations,
  ...PermissionMutation,
  ...tokenMutation
};

const Query = {
  ...UserQuery,
  ...PermissionQuery,
  ...tokenQuery
};

export { Mutation, Query };
