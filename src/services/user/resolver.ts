import UserDatasource from "./datasource";
import { Request, Response } from "express";
import {
  Generalres,
  IReg,
  isEmail,
  registerResponse,
  validateresetInput,
} from "./userTypesAndValidation";
import 
{
ErrorHandlers
}
from '../../helpers/errorHandler'
import jwt from "jsonwebtoken";
import "../../events/user/userEvents";
import { ACCESS_SECRETKEY, REFRESH_SECRETKEY, VERIFY_SECRETKEY } from "../../config/config";
import { eventEmitter } from "../../events/user/userEvents";
import { logger } from "../../config/logger";
import { User } from "../../app";
import {
  validateLoginInput,
  validateRegistrationInput,
  IVerifyUserMutation,
} from "./userTypesAndValidation";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { tokenModel } from "../../models/token";
import { tokenDataSource } from "../tokens/dataSource";

//REGISTER MUTATION
export const registerMutation = {
  async userRegistration(
    __: unknown,
    { data }: { data: IReg }
  ): Promise<registerResponse> {
    const { email, firstName, lastName, password, role} = data;
  
    try {
     
      if(lastName)
      {
        if(typeof lastName !== "string")
        {
          throw new ErrorHandlers().UserInputError("Please Enter a valid Last name")
        }
      }
      if (!email || !firstName || !password ) {
        throw new ErrorHandlers().UserInputError("Please provide all required fields");
      }
     
      validateRegistrationInput({email, password, firstName, role});

      const findEmail = await UserDatasource.findByEmail(email);
      if (findEmail) throw new ErrorHandlers().ConflicError("User already exists");
      const createUser = await UserDatasource.userRegistration(data);

      if (createUser) {
        const { _id, email, firstName, lastName, role } = createUser

        const token = jwt.sign({ email, _id: createUser._id }, VERIFY_SECRETKEY as string, {
          expiresIn: "1hr",
        });

        // emit event to send verification email
        eventEmitter.emit("newUser", { email, token, username:firstName });
        return { status: "success", _id, email, firstName, lastName, role };
      }

      throw new Error("Error registering, please try again later");
    } catch (error) {
      throw error;
    }
  },
};

// VERIFY USER MUTATION
export const verifyUserMutation = {
  async verifyAccount(
    _: any,
    args: any,
    { user }: { req: Request; user: User }
  ): Promise<Generalres> {
    try {
      if (!user) throw new ErrorHandlers().NotFound("User not found in request");
      

      const { email } = user as User;

      if (!email) throw new ErrorHandlers().UserInputError("invalid token");

      const findEmail = await UserDatasource.findByEmail(email);
      if (!findEmail) throw new ErrorHandlers().NotFound("User does not exist");
      
      const verify = await UserDatasource.verifyEmail(email);
      if (verify)  return { status: "success", message: "User has been verified" }; // update....
      
      throw new Error("Email verification failed");

    } catch (error) {
      throw error;
    }
  },
};
// REQUEST VERIFICATION
export const requestVerification = {
  async requestVerification(_: any, { data }: { data: { email: string } }): Promise<Generalres> {
    try {
      const { email } = data;
      isEmail({email})
      if (!email) {
        throw new ErrorHandlers().UserInputError("Please Provide An Email");
      }

      const findEmail = await UserDatasource.findByEmail(email);

      if (!findEmail) {
        throw new ErrorHandlers().NotFound("User with that email does not exist");
      }

      const username = findEmail.firstName;

      const token = jwt.sign({ email }, VERIFY_SECRETKEY as string, {
        expiresIn: "1hr",
      });
      eventEmitter.emit("newUser", { email, token, username });
      return { status: "success", message: "request verification successfull" };
    } catch (error) {
      throw error;
    }
  },
};
// LOGIN MUTATION
export const loginUserMutation = {
  async Login(
    _: any,
    { data }: { data: { email: string; password: string } },
    context: { req: Request, res: Response }
  ): Promise<{ accessToken: string }> {
    const { email, password } = data;
    const { res }= context
    try {
      validateLoginInput(data);

      if (!email || !password) throw new ErrorHandlers().UserInputError("Please provide all required fields");
      

      const userExist = await UserDatasource.findByEmail(email);
     
      if (!userExist) throw new ErrorHandlers().NotFound("User with that email not found");
      
     
      if (userExist.emailVerified == false) throw new ErrorHandlers().ForbiddenError("Please Verify Your Email Before Login");
      
      const comparePassword: boolean = await bcrypt.compare(password, userExist.password);
      if (comparePassword) {

     
      const tokenId = crypto.randomBytes(12).toString('hex')
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000

      const accessToken = jwt.sign( { _id: userExist._id }, ACCESS_SECRETKEY as string, { expiresIn: "1hr" });
      const refreshToken = jwt.sign( { _id: userExist._id, tokenId}, REFRESH_SECRETKEY as string, { expiresIn: "7d" });
        
      await new tokenDataSource().newToken(tokenId, userExist._id, expiresAt)
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false, // for http
          expires: new Date(expiresAt),
        })
        
        return { accessToken };
      }
      throw new ErrorHandlers().AuthenticationError("Password is incorrect");
    } catch (error) {
      throw error;
    }
  },
};
// FORGOT PASSWORD
export const forgotPasswordMutation = {
  async forgotPassword(
    _: any,
    { data }: { data: { email: string } }
  ): Promise<Generalres> {
    try {
      const { email } = data;
      isEmail(data);
      if (!email) {
        throw new ErrorHandlers().UserInputError("Email must be specified");
      }

      const userExist = await UserDatasource.findByEmail(email);
      if (userExist) {
        const user_id = userExist._id;
        const token = crypto.randomBytes(32).toString("hex");
        const sha256Hash = crypto
          .createHash("sha256")
          .update(token)
          .digest("hex");
        const expiresAt = Date.now() + 900000; // 15 minutes

        const newPasswordRequest = UserDatasource.passwordRequest({
          user_id,
          email,
          sha256Hash,
          expiresAt,
        });
        let link = `http://localhost:3000/resetpassword?email=${email}&token=${token}`; // for dev
        let username = userExist.firstName;
        eventEmitter.emit("forgotPassword", { username, link, email });
        return {
          status: "success",
          message: "Please Check your email for further instructions",
        };
      }

      throw new ErrorHandlers().NotFound("No user with that email was found");
    } catch (error) {
      throw error;
    }
  },
};
// RESET PASSWORD
export const resetPasswordMutation = {
  async resetPassword(
    _: any,
    { data }: { data: { email: string; newPassword: string; token: string } }
  ): Promise<Generalres> 
  {
    let { email, newPassword, token } = data;
   try {
    if (!email || !newPassword || !token) {
      throw new ErrorHandlers().UserInputError("Please provide all required fields");
    }
    validateresetInput(data)
    const userExist = await UserDatasource.findByEmail(email);
    if (!userExist) throw new ErrorHandlers().NotFound("User with that email does not exist");
    const samePassword = await bcrypt.compare(newPassword, userExist.password)
    if(samePassword) throw new ErrorHandlers().UserInputError('New Password Matches Old Password')
 
    
    const sha256Hash = crypto.createHash("sha256").update(token).digest("hex");
    const findToken = await UserDatasource.findByEmailAndToken({
      email,
      sha256Hash,
    });
    if (!findToken) throw new ErrorHandlers().NotFound("Invalid token");
  

    const expiresAt = findToken.expiresAt;
    if (Date.now() > expiresAt) throw new ErrorHandlers().UserInputError("The provided Link has expired");
    
    newPassword = await bcrypt.hash(newPassword, 12)
  
    const setPassword = UserDatasource.updatePassword(email, newPassword, sha256Hash);
    if (!setPassword) throw new Error("Error updating password at this time");
    
    eventEmitter.emit("resetPassword", {email, firstname: userExist.firstName});
   
    return { status: "success", message: "password has been updated" };
  
   } catch (error) {
    throw error
   }},
};
export const UserQuery = {
  async getUserProfile() {
    return "User profile";
  },
};

export const userMutations = 
{
  ...registerMutation,
  ...verifyUserMutation,
  ...requestVerification,
  ...loginUserMutation,
  ...forgotPasswordMutation,
  ...resetPasswordMutation
}
