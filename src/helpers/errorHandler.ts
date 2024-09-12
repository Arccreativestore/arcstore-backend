import { GraphQLError, GraphQLErrorOptions } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";

export enum ApolloExtraErrorCodes {
  AuthenticationError = "UNAUTHENTICATED",
  ValidationError = "VALIDATION_FAILED",
  FORBIDDEN = "FORBIDDEN",
  BAD_USER_INPUT = "BAD_USER_INPUT",
  NOT_FOUND_ERROR = "NOT_FOUND",
  CONFLICT_ERROR = "CONFLICT"
}
class GraphQLErrorWithCode extends GraphQLError {
  constructor(
    message: string,
    code: ApolloServerErrorCode | ApolloExtraErrorCodes,
    options?: GraphQLErrorOptions
  ) {
    super(message, {
      ...options,
      extensions: { ...options?.extensions, code },
    });
    this.name = this.constructor.name;
  }
}
export class ErrorHandlers {
  UserInputError(graphqlError: string, options?: GraphQLErrorOptions) {
    const error = new GraphQLError(graphqlError, options);

    return new GraphQLErrorWithCode(
      error.message,
      ApolloServerErrorCode.BAD_USER_INPUT,
      {
        nodes: error.nodes,
        originalError: error.originalError ?? error,
        extensions: { ...error.extensions, http: { status: 400 } },
      }
    );
  }

  AuthenticationError(message?: string, options?: GraphQLErrorOptions) {
    const error = new GraphQLError(
      message || "Account Not Authenticated",
      options
    );

    return new GraphQLErrorWithCode(
      error.message,
      ApolloExtraErrorCodes.AuthenticationError,
      {
        nodes: error.nodes,
        originalError: error.originalError ?? error,
        extensions: { ...error.extensions, http: { status: 401 } },
      }
    );
  }

  ValidationError(message: string, options?: GraphQLErrorOptions) {
    const error = new GraphQLError(message);

    return new GraphQLErrorWithCode(
      error.message,
      ApolloExtraErrorCodes.ValidationError,
      {
        nodes: error.nodes,
        originalError: error.originalError ?? error,
        extensions: { ...error.extensions, http: { status: 400 } },
      }
    );
  }

  ForbiddenError(message?: string, options?: GraphQLErrorOptions) {
    const error = new GraphQLError(message || "Action Not Allowed", options);

    return new GraphQLErrorWithCode(
      error.message,
      ApolloExtraErrorCodes.FORBIDDEN,
      {
        nodes: error.nodes,
        originalError: error.originalError ?? error,
        extensions: { ...error.extensions, http: { status: 403 } },
      }
    );
  }

  NotFound(message?: string, options?: GraphQLErrorOptions) {
    const error = new GraphQLError(message || "Resource Not Found", options);

    return new GraphQLErrorWithCode(
      error.message,
      ApolloExtraErrorCodes.NOT_FOUND_ERROR,
      {
        nodes: error.nodes,
        originalError: error.originalError ?? error,
        extensions: { ...error.extensions, http: { status: 404 } },
      }
    );
  }

  ConflicError(message?: string, options?: GraphQLErrorOptions) {
    const error = new GraphQLError(message || "Resource Already Exist", options);

    return new GraphQLErrorWithCode(
      error.message,
      ApolloExtraErrorCodes.CONFLICT_ERROR,
      {
        nodes: error.nodes,
        originalError: error.originalError ?? error,
        extensions: { ...error.extensions, http: { status: 409 } },
      }
    );
  }
}
