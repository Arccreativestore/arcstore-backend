import { UserMutation, verifyUserMutation, UserQuery } from "./services/user/resolver";


const Mutation = {
  ...UserMutation,
  ...verifyUserMutation
  
};

const Query = {
  ...UserQuery,

};

export { Mutation, Query };
