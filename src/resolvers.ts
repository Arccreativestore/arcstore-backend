import { authMutations, authQuery} from "./services/auth/resolver";
import { tokenMutation, tokenQuery } from "./services/tokens/resolvers";
import UserQueries from "./services/users/resolvers";
import {faqMutations, faqQueries} from "./services/Faq/resolvers";
import { AssetMutation, AssetQuery } from "./services/asset/resolver";
import {
  PermissionMutation,
  PermissionQuery,
} from "./services/permission/resolver";
import { creatorMutation } from "./services/creators/resolvers";

const Mutation = {
  ...authMutations,
  ...PermissionMutation,
  ...tokenMutation,
  ...faqMutations,
  ...AssetMutation
};

const Query = {
  ...authQuery,
  ...UserQueries,
  ...PermissionQuery,
  ...tokenQuery,
  ...faqQueries,
  ...AssetQuery,
  ...creatorMutation
};

export { Mutation, Query };
