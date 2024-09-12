import { GraphQLFormattedError } from "graphql";
import { isDev } from "../config/config.js";
import { ApolloExtraErrorCodes } from "./errorHandler";


const ErrorFormat = (
  formattedError: GraphQLFormattedError
): GraphQLFormattedError => {
  const code = formattedError.extensions?.code;
  if (
    code === ApolloExtraErrorCodes.AuthenticationError ||
    code === ApolloExtraErrorCodes.ValidationError ||
    code === ApolloExtraErrorCodes.FORBIDDEN ||
    code === ApolloExtraErrorCodes.BAD_USER_INPUT
  ) {
    return formattedError;
  }

  if (isDev) {
    return formattedError;
  }
  console.log(JSON.stringify({formattedError}, null, 2))
  return {
    message: "Error Processing request",
    locations: formattedError.locations,
    path: formattedError.path,
    extensions: formattedError.extensions,
  };
};

export default ErrorFormat;
