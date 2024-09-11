import { userMutations, UserQuery } from "./services/user/resolver";
import {
  PermissionMutation,
  PermissionQuery,
} from "./services/permission/resolver";

const Mutation = {
  ...userMutations,
  ...PermissionMutation,
};

const Query = {
  ...UserQuery,
  ...PermissionQuery,
};

export { Mutation, Query };
