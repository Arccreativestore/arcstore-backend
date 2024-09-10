import UserDatasource from "./datasource";
import { Request } from "express";
import { IReg, registerResponse, regValidationSchema } from "./userTypesAndValidation";
import {
  ConflictError,
  BadreqError,
  NotFoundError,
  UnauthorizedError,
} from "../../middleware/errors";
import jwt from "jsonwebtoken";
import "../../events/user/userEvents";
import { ACCESS_SECRETKEY, VERIFY_SECRETKEY } from "../../config/config";
import { eventEmitter } from "../../events/user/userEvents";
import { logger } from "../../config/logger";
import { User } from "../../app";
import {  validateLoginInput, validateRegistrationInput, IVerifyUserMutation } from "./userTypesAndValidation";
import bcrypt from 'bcrypt'


//REGISTER MUTATION
export const UserMutation = {
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

// VERIFY USER MUTATION 
export const verifyUserMutation: IVerifyUserMutation = {
  async verifyAccount(_: any, args: any, { user }: { req: Request, user: User }): Promise<{ status: string }> {
   
    
    
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

// LOGIN MUTATION

export const loginUserMutation = 
{
  async Login(_: any, {data}: {data:{email: string, password: string}} , context: {req: Request}): Promise<{token: string}>
  {
   
    const { email, password } = data
    logger.info(JSON.stringify(data))
    //validateLoginInput(data)
    if(!email || !password)
    {
      throw new BadreqError('Fields Email or Password is Required')
    }
    const userExist =  await UserDatasource.findByEmail(email) 

    if(!userExist)
    {
      throw new NotFoundError('User with that email not found')
    }

    const comparePassword: boolean = await bcrypt.compare(password, userExist.password)
    logger.info(comparePassword)
    if(comparePassword)
    {
      const token = jwt.sign({_id: userExist._id}, ACCESS_SECRETKEY as string, { expiresIn: '15m'})
      return { token }
    }
    throw new UnauthorizedError('Password is incorrect')
    
  }
}


export const UserQuery = {
  async getUserProfile() {
    // Placeholder logic, could be extended to fetch user profile data
    return "User profile";
  },
};

