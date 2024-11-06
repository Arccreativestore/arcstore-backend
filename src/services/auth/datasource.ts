import Base from "../../base";
import { userModel } from "../../models/user";
import {
  IReg,
  dbResponse,
  IresetPassword,
  IupdateProfile,
} from "./types";
import "../../events/user/userEvents";
import { logger } from "../../config/logger";
import { IAccount } from "../../models/user";
import { resetPasswordModel } from "../../models/resetpassword";
import { tokenModel } from "../../models/token";
import { ObjectId } from "mongoose";
import { User } from "../../app";
import __WorkSchema from '../../models/work'
import { ErrorHandlers } from "../../helpers/errorHandler";

export class UserDatasource extends Base {
  async userRegistration(data: IReg): Promise<dbResponse | null> {
    try {
      const create = await this.handleMongoError(userModel().create(data));

      return create ? create.toObject() : null;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }

  async findById(_id: ObjectId){
    try {
      const find = await userModel().findById(_id).select('-password')
      return find ? find.toObject() : null
    } catch (error) {
      logger.error(error)
      throw error
    }
  }

  async findByEmail(email: string): Promise<dbResponse | null> {
    try {
      const emailExist = await userModel().findOne({ email });
      return emailExist ? emailExist.toObject() : null;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }

  async verifyEmail(email: string): Promise<IAccount | null> {
    try {
      const verifyAccount = await userModel().findOneAndUpdate(
        { email },
        { emailVerified: true, verifiedDate: new Date() },
        { new: true }
      );

      return verifyAccount ? verifyAccount.toObject() : null;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async passwordRequest(data: IresetPassword): Promise<IresetPassword | null> {
    try {
      const { user_id, email, sha256Hash, expiresAt } = data;
      const newRequest = await resetPasswordModel().create({user_id, email, token:sha256Hash, expiresAt});
      return newRequest ? newRequest.toObject() : null;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async findByEmailAndToken(data: {
    email: string;
    sha256Hash: string;
  }): Promise<IresetPassword | null> {
    try {
      const { email, sha256Hash } = data;
      const findToken = await resetPasswordModel().findOne({
        email,
        token: sha256Hash,
      });

      return findToken ? findToken.toObject() : null;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async updatePassword(email: string, password: string, sha256: string): Promise<boolean> {
    try {
      
      const newPassword = await userModel().updateOne({ email}, {$set:{ password}});

      if(newPassword.matchedCount > 0)
      {
       await resetPasswordModel().updateOne({email, token: sha256}, {$set:{passwordChanged: true, expiresAt: Date.now()}})
       return true
      }
      return false;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

 
  async updateProfile(_id: ObjectId, data: IupdateProfile){
      try {
        
        const update = await userModel().findOneAndUpdate({_id}, data, {new: true})
        
        return update ? update.toObject() : null
      } catch (error) {
        logger.error(error)
        throw error
      }
  }

  async setPassword(_id: ObjectId, password: string){
    try {
      
    const find = await userModel().updateOne({_id}, {$set: {password}})
    if(find) return {status: "success", message: "password updated successfully"}
    throw new Error('server error')

    } catch (error) {
      logger.error(error)
    }
  }


  async createOrUpdateWork(data:any, user:User){
    const userWork = await __WorkSchema().findOne({userId:user._id})

    if(!userWork){
        this.handleMongoError(__WorkSchema().create({...data, userId:user._id}))
        return "Work created successfully"
    }

    const updated = await __WorkSchema().updateOne({userId:user._id}, {$set:{...data}})
    if(updated.matchedCount > 0) return "Work updated successfully"
    throw new ErrorHandlers().ValidationError("Unable to update work, please try again.")

  }

  async getUserWorkSetting(user:User){
      return await __WorkSchema().findOne({userId:user._id.toString()})
  }

}
