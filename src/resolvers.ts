import { authMutations, authQuery} from "./services/auth/resolver";
import { tokenMutation, tokenQuery } from "./services/tokens/resolvers";
import UserQueries from "./services/users/resolvers";
import {faqMutations, faqQueries} from "./services/Faq/resolvers";
import {
  PermissionMutation,
  PermissionQuery,
} from "./services/permission/resolver";
import { AssetMutation, AssetQuery } from "./services/asset/resolver";
import { SubscriptionMutation, SubscriptionQuery } from "./services/subscription/resolver";
import { creatorMutation } from "./services/creators/resolvers";
import { _2faMutation, _2faQuery } from "./services/_2fa/resolvers";

const Mutation = {
  ...authMutations,
  ...PermissionMutation,
  ...tokenMutation,
  ...faqMutations,
  ...AssetMutation,
  ...SubscriptionMutation,
  ...AssetMutation,
  ..._2faMutation
};

const Query = {
  ...authQuery,
  ...UserQueries,
  ...PermissionQuery,
  ...tokenQuery,
  ...faqQueries,
  ...AssetQuery,
  ...SubscriptionQuery,
  ...creatorMutation,
  ..._2faQuery
};

export { Mutation, Query };
