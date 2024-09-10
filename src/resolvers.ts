
import { UserMutation, verifyUserMutation, UserQuery, loginUserMutation } from "./services/user/resolver";
import { PermissionMutation, PermissionQuery } from "./services/permission/resolver";


const Mutation = {
  ...UserMutation,
  ...verifyUserMutation,
  ...loginUserMutation,
  ...PermissionMutation,
};

const Query = {
  ...UserQuery,
  ...PermissionQuery
};

export { Mutation, Query };
