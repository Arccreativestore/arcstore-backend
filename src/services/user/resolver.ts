import UserDatasource from "./datasource";
import { Request } from "express";
import { IReg, registerResponse, regValidationSchema } from "./interfaces";
import {
  ConflictError,
  BadreqError,
  NotFoundError,
} from "../../middleware/errors";
import jwt from "jsonwebtoken";
import "../../events/user/userEvents";
import { VERIFY_SECRETKEY } from "../../config/config";
import { eventEmitter } from "../../events/user/userEvents";
import { logger } from "../../config/logger";
import { User } from "../../app";
import { IUserMutation } from "./interfaces";

export const UserMutation: IUserMutation = {
  async userRegistration(
    __: unknown,
    { data }: { data: IReg }
  ): Promise<registerResponse> {
    const { email, username, password } = data;

    try {
      // Validate registration input
      validateRegistrationInput(data);

      // Basic field presence check
      if (!email || !username || !password) {
        throw new BadreqError("Input fields are incomplete");
      }

      // Check if the email is already in use
      const findEmail = await UserDatasource.findByEmail(email);
      if (findEmail) {
        throw new ConflictError("User already exists");
      }
    
     
      // Create the user in the database
      const createUser = await UserDatasource.userRegistration(data);
     

      
      if (createUser) { 
        const { _id, email, username, role } = createUser;

        const token = jwt.sign({ _id, email}, VERIFY_SECRETKEY as string, {
          expiresIn: "1hr",
        });
        // emit event to send verification email
        eventEmitter.emit("newUser", { email, token, username });
        return { status: "success", _id, email, username, role };
      }

      throw new Error("Error registering, please try again later");
    } catch (error) {
      // Log the error and rethrow it
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  },


  
};

export const verifyUserMutation = {
  async verifyAccount(_: any, args: any, { req, user }: { req: Request, user: User }) {
   
    
    
    try {
      if (!user) {
        throw new NotFoundError("User not found in request");
      }

      const { email } = user as User;
      
      if(!email)
      {
        throw new BadreqError('invalid token')
      }

      const findEmail = await UserDatasource.findByEmail(email);
      if (!findEmail) {
        throw new NotFoundError("User does not exist");
      }

      const verify = await UserDatasource.verifyEmail(email);
      if (verify) {
        return { status: "success" }; // update....
      }

      throw new Error("Email verification failed");
    } catch (error) {
      // Log and rethrow the error
      logger.error(`Verification error: ${error.message}`);
      throw error;
    }
  },
};

export const UserQuery = {
  async getUserProfile() {
    // Placeholder logic, could be extended to fetch user profile data
    return "User profile";
  },
};

const validateRegistrationInput =(data: IReg): void => {
  const { error } = regValidationSchema.validate(data);
  if (error) {
    logger.error(`Validation error: ${error.message}`);
    throw new BadreqError(error.message);
  }
}
