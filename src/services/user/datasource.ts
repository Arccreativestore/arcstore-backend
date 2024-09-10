import Base from "../../base";
import { userModel } from "../../models/user";
import { IReg, regValidationSchema, dbResponse } from "./userTypesAndValidation";
import "../../events/user/userEvents";
import { logger } from "../../config/logger";
import { IAccount } from "../../models/user";
import { BadreqError } from "../../middleware/errors";
 


class UserDatasource extends Base {

  

  async userRegistration(data: IReg): Promise<dbResponse | null> {
    try {
     
      const create = await userModel.create(data);
    
        return create ? (create.toObject()) : null;
      
      
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<dbResponse | null> {
    try {
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return emailExist.toObject();
      }
      return null;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }

  async verifyEmail(email: string): Promise<IAccount | null> {
    const verifyAccount = userModel.findOneAndUpdate(
      { email },
      { emailVerified: true, verifiedDate: new Date() },
      { new: true }
    );
    return verifyAccount;
  }
}

export default new UserDatasource();
