import Base from "../../base";
import { userModel } from "../../models/user";
import {
  IReg,
  dbResponse,
  IresetPassword,
} from "./userTypesAndValidation";
import "../../events/user/userEvents";
import { logger } from "../../config/logger";
import { IAccount } from "../../models/user";
import { resetPasswordModel } from "../../models/resetpassword";
import { tokenModel } from "../../models/token";
import { ObjectId } from "mongoose";

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
 
}
export default new UserDatasource();
