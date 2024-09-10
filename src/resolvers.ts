import { log } from "console";
import { UserMutation, verifyUserMutation, UserQuery, loginUserMutation } from "./services/user/resolver";


const Mutation = {
  ...UserMutation,
  ...verifyUserMutation,
  ...loginUserMutation
};

const Query = {
  ...UserQuery,

};

export { Mutation, Query };
