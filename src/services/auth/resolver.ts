import {UserDatasource} from "./datasource";
import { Request, Response } from "express";
import {
  Generalres,
  IReg,
  isEmail,
  IupdateProfile,
  registerResponse,
  validatePassword,
  validateresetInput,
  validateUpdateProfileInput,
} from "./types";
import 
{
ErrorHandlers
}
from '../../helpers/errorHandler'
import jwt from "jsonwebtoken";
import "../../events/user/userEvents";
import { ACCESS_SECRETKEY, REFRESH_SECRETKEY, VERIFYEMAIL_SECRETKEY } from "../../config/config";
import { eventEmitter } from "../../events/user/userEvents";
import { logger } from "../../config/logger";
import { User } from "../../app";
import {
  validateLoginInput,
  validateRegistrationInput,
  IVerifyUserMutation,
} from "./types";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { tokenModel } from "../../models/token";
import { tokenDataSource } from "../tokens/dataSource";
import { verifyEmail } from "../../utils/mails/verifyMail";
import { resolve } from "path";
import { isValidObjectId, ObjectId } from "mongoose";
import { verifyEmailPayload } from "./helper";
import Joi from "joi";
import parsePhoneNumberFromString from "libphonenumber-js";
import _2faDatasource from "../_2fa/datasource";
import { log } from "console";
import { IAccount } from "../../models/user";
import { isUserAuthorized } from "../../helpers/utils/permissionChecks";


//REGISTER MUTATION
export const registerMutation = {
  async userRegistration(__: unknown,{ data }: { data: IReg },context: { req: Request, res: Response }): Promise<registerResponse> {
    const { email, firstName, lastName, password, role, subscribedToEmailTips }  = data;
    const { res }= context
    try {
     
      validateRegistrationInput({email, password, firstName, lastName, role});
      const findEmail = await new UserDatasource().findByEmail(email);
      if (findEmail) throw new ErrorHandlers().ConflicError("User already exist");
      const createUser = await new UserDatasource().userRegistration(data);

      if (createUser) {

      const { _id, email, firstName, lastName, role } = createUser
      const token = jwt.sign({ email, _id: createUser._id }, VERIFYEMAIL_SECRETKEY as string, {expiresIn: "1hr"});

      const verificationLink = `https://arcstore-frontend.fly.dev/accounts/verify/${token}`
      eventEmitter.emit('newUser', {email, username: firstName, verificationLink})
      const tokenId = crypto.randomBytes(12).toString('hex')
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000

      const accessToken = jwt.sign( { _id}, ACCESS_SECRETKEY as string, { expiresIn: "30d" }); //Updated this to 30 days for development against 1hr
      const refreshToken = jwt.sign( { _id, tokenId}, REFRESH_SECRETKEY as string, { expiresIn: "30d" }); //Make this to be 30 days for development against 7d
        
      await new tokenDataSource().newToken(tokenId, _id, expiresAt)
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false, // for http
          expires: new Date(expiresAt),
        })
        
      return { status: "success", _id, email, firstName, lastName, role, accessToken };

      }
      throw new Error("Error registering, please try again later");

    } catch (error) {
      throw error;
    }
  },
};

// VERIFY USER MUTATION
export const verifyUserQuery = {
  async verifyAccount(_: any, {data}: {data: {token: string}}): Promise<Generalres> {
    try {
      
      const token = data?.token
      if(!token) throw new ErrorHandlers().UserInputError("Please provide a token");
      const decode: any = verifyEmailPayload(token)
      const  email  = decode?.email 
      isEmail({email})
      const findEmail = await new UserDatasource().findByEmail(email);
      if (!findEmail) throw new ErrorHandlers().NotFound("User does not exist");
      
      const verify = await new UserDatasource().verifyEmail(email);
      if (verify)  return { status: "success", message: "User has been verified" }; // update...
      throw new Error("Email verification failed");

    } catch (error) {
      throw error;
    }
  },
};
// REQUEST VERIFICATION
export const requestEmailVerification = {
  async requestEmailVerification(_: any, { data }: { data: { email: string } }): Promise<Generalres> {
    try {

      const { email } = data;
      isEmail({email})

      const findEmail = await new UserDatasource().findByEmail(email);
      if (!findEmail) throw new ErrorHandlers().NotFound("User with that email does not exist");
      const username = findEmail.firstName;

      const token = jwt.sign({ email, _id: findEmail._id }, VERIFYEMAIL_SECRETKEY as string, { expiresIn: "1hr"});
      const verificationLink = `https://arcstore-frontend.fly.dev/accounts/verify/${token}`
      eventEmitter.emit("newUser", { email, verificationLink, username });
      return { status: "success", message: "request verification successfull" };
    } catch (error) {
      throw error;
    }
  },
};
// LOGIN MUTATION
export const loginUserMutation = {
  async Login(_: any,{ data }: { data: { email: string; password: string, rememberMe: boolean } },context: { req: Request, res: Response }): Promise<{ accessToken?: string, status?: string, message?: string}> {
    const { email, password, rememberMe} = data;
    const { res }= context
    try {
     // log(password)
      // validateLoginInput(data);
      if (!email || !password) throw new ErrorHandlers().UserInputError("Please provide all required fields");
      

      const userExist = await new UserDatasource().findByEmail(email);
      if (!userExist) throw new ErrorHandlers().NotFound("User with that email not found");
      if(userExist.disabled) throw new ErrorHandlers().AuthenticationError('your account is disabled')
      
     // if (userExist.emailVerified == false) throw new ErrorHandlers().ForbiddenError("Please Verify Your Email Before Login")
      if(!userExist.password) throw new ErrorHandlers().AuthenticationError('Please signin with the method you used to signup')
      const comparePassword: boolean = await bcrypt.compare(password, userExist.password);
      if (comparePassword) {

      if(userExist._2fa) { 
        let otp = generateOTP() 
          // store otp in database 
        const saveOtp = await new _2faDatasource().saveOtp(otp, userExist._id)
        if(!saveOtp) throw new Error('could not send otp at this time')
          // send otp in email to client
        return { status: "success", message: "otp has been sent to users email"}
        }
      
      let accessToken: string;

      
      const tokenId = crypto.randomBytes(12).toString('hex')
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000
      
      accessToken = jwt.sign( { _id: userExist._id }, ACCESS_SECRETKEY as string, { expiresIn: "30d" });//Updated this to 30 days for development against 1hr
    
      const refreshToken = jwt.sign( { _id: userExist._id, tokenId}, REFRESH_SECRETKEY as string, { expiresIn: "30d" }); //Make this to be 30 days for development against 7d
        
         await new tokenDataSource().newToken(tokenId, userExist._id, expiresAt)
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false, // for http
          expires: new Date(expiresAt),
        })

        if(rememberMe) {
          accessToken = jwt.sign( { _id: userExist._id }, ACCESS_SECRETKEY as string, { expiresIn: "7d" }); 
          return { accessToken };
        }
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
  async forgotPassword(_: any, { data }: { data: { email: string } }): Promise<Generalres> {
    try {

      const { email } = data;
      isEmail(data);
      if (!email) {
        throw new ErrorHandlers().UserInputError("Email must be specified");
      }

      const userExist = await new UserDatasource().findByEmail(email);
      if (userExist) {
        const user_id = userExist._id;

        const otp = GenerateOTP()
        const token = crypto.randomBytes(32).toString("hex");
        const sha256Hash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
        const expiresAt = Date.now() + 900000; // 15 minutes

        const newPasswordRequest = await new UserDatasource().passwordRequest({
          user_id,
          email,
          otp,
          expiresAt,
        });


        //let link = `https://arcstore-frontend.fly.dev/accounts/resetpassword?email=${email}&token=${token}`; // for dev 
        let username = userExist.firstName;
        eventEmitter.emit("forgotPassword", { username, otp, email });
        return { status: "success",message: "Please Check your Email for further instructions",};
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
    { data }: { data: { email: string; newPassword: string; otp: string } }
  ): Promise<Generalres> 
  {
    let { email, newPassword, otp } = data;
   try {
    if (!email || !newPassword || !otp) throw new ErrorHandlers().UserInputError("Please provide all required fields");
    
    validateresetInput(data)
    const userExist = await new UserDatasource().findByEmail(email);
    if (!userExist) throw new ErrorHandlers().NotFound("User with that email does not exist");
    const samePassword = await bcrypt.compare(newPassword, userExist.password)
    if(samePassword) throw new ErrorHandlers().UserInputError('New Password Matches Old Password')
 
    
   // const sha256Hash = crypto.createHash("sha256").update(token).digest("hex");
    const findToken = await new UserDatasource().findByEmailAndToken({email,otp});
    if (!findToken) throw new ErrorHandlers().NotFound("Invalid token");
  

    const expiresAt = findToken.expiresAt;
    if (Date.now() > expiresAt) throw new ErrorHandlers().UserInputError("The provided otp has expired");
    newPassword = await bcrypt.hash(newPassword, 12)
  
    const setPassword = await new UserDatasource().updatePassword(email, newPassword, otp);
    if (!setPassword) throw new Error("Error updating password at this time");
    //eventEmitter.emit("resetPassword", {email, firstname: userExist.firstName});
    return { status: "success", message: "password has been updated" };
  
   } catch (error) {
    throw error
   }},
};

const updateProfile = {
  async updateUserProfile(__: any, {data}: {data: IupdateProfile}, context: {user: User}){
      
      try {

        const  user = context?.user
        if(!user) throw new ErrorHandlers().AuthenticationError("Please Login to Proceed")
        const { _id } = user
        validateUpdateProfileInput(data)
        let phoneNumber
        if(data.phoneNumber) phoneNumber = parsePhoneNumberFromString(data.phoneNumber)
        delete data.phoneNumber 
        console.log(data)
        const  email  = data?.email
        if(email) {
          const userExist = await new UserDatasource().findByEmail(email)
          if(userExist) throw new ErrorHandlers().ConflicError('This Email is Already In Use')
          const newData = { emailVerified: false, verifiedDate: '', phoneNumber, ...data}
          return handleProfileUpdate(_id, newData, email)
        }
        const newData = {phoneNumber, ...data}
        return handleProfileUpdate(_id, newData)

      } catch (error) {
        throw error
      }
  },
 
}
async function handleProfileUpdate(_id: ObjectId , data: any, email?: string){

  const updateProfile = await new UserDatasource().updateProfile(_id, data);
  if (!updateProfile) throw new ErrorHandlers().ValidationError("Unable to update profile");

  if (email) {
    const token = jwt.sign({ email, _id: updateProfile._id }, ACCESS_SECRETKEY as string, { expiresIn: "1hr" });
    const firstName = updateProfile.firstName;
    const verificationLink = `https://arcstore-frontend.fly.dev/accounts/verify/${token}`;
    
    eventEmitter.emit("newUser", { email, username: firstName, verificationLink });
  }

  return { status: "success", message: "Profile updated" };
}

function generateOTP(): number {
  return Math.floor(1000 + Math.random() * 9000);
}
const setPasswordAfter3rdPartyAuth = {

    async setPasswordAfter3rdPartyAuth(__: any, {data}:{data: {password: string}}, context: {user: User}){

          try {
            
          const userId = context?.user?._id
          if(!userId) throw new ErrorHandlers().AuthenticationError('Please login to proceed')
          let password = data?.password
          validatePassword(password)
          password = await bcrypt.hash(password, 12)
          return await new UserDatasource().setPassword(userId, password)

          } catch (error) {
            throw error
          }
    }
}

const updatePassword = {

  async updatePassword(__: any, {data}: {data:{oldPassword: string, newPassword: string}}, context: {user: User}){
    try {
            
      const userId = context?.user?._id
      if(!userId) throw new ErrorHandlers().AuthenticationError('Please login to proceed')
      const { oldPassword, newPassword } = data;
      validatePassword(oldPassword);
      validatePassword(newPassword);

      const user = await new UserDatasource().findById(userId);
      if (!user) throw new ErrorHandlers().NotFound("User not found");

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new ErrorHandlers().AuthenticationError("Old password is incorrect");

      if (oldPassword === newPassword) throw new ErrorHandlers().UserInputError("New password cannot be the same as the old password");

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      return await new UserDatasource().setPassword(userId, hashedNewPassword);
      

      } catch (error) {
        throw error
      }
  }
}



//WORK ADD & UPDATE
export const workMutation = {
  async createOrUpdateWork(__: unknown,{ data }: { data: any }, context:{req:Request, res:Response, user:User}): Promise<string> {
    isUserAuthorized(context.user, this.createOrUpdateWork.name, true)
    return await new UserDatasource().createOrUpdateWork(data, context.user)
  }
};


//WORK ADD & UPDATE
export const workQuery = {
  async getUserWorkSetting(__: unknown,_:unknown, context:{req:Request, res:Response, user:User}) {
    isUserAuthorized(context.user, this.getUserWorkSetting.name, true)
    return await new UserDatasource().getUserWorkSetting(context.user)
  }
};
function GenerateOTP(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
}

export const authQuery = {
 ...verifyUserQuery,
 ...requestEmailVerification,
 ...updatePassword,
 ...setPasswordAfter3rdPartyAuth,
 ...workQuery
};

export const authMutations = 
{
  ...registerMutation,
  ...loginUserMutation,
  ...forgotPasswordMutation,
  ...resetPasswordMutation,
  ...updateProfile,
  ...workMutation
}
