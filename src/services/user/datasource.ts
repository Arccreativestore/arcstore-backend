import Base from "../../base";
import { userModel } from "../../models/user";
import { IReg, regValidationSchema, registerResponse } from "./interfaces";
import "../../events/user/userEvents";
import { logger } from "../../config/logger";
import { IAccount } from "../../models/user";
import { BadreqError } from "../../middleware/errors";
 


class UserDatasource extends Base {

  private validateRegistration(data: IReg): void {
    const { error } = regValidationSchema.validate(data);
    if (error) {
      logger.error(`Validation error: ${error.message}`);
      throw new BadreqError(error.message);
    }
  }

  async userRegistration(data: IReg): Promise<registerResponse | null> {
    try {
      this.validateRegistration(data)
      const create = await userModel.create(data);
    
        return create ? (create.toObject() as registerResponse) : null;
      
      
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<boolean> {
    try {
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return true;
      }
      return false;
    } catch (error: any) {
      logger.error(error.message);
      throw error;
    }
  }

  async verifyEmail(email: string): Promise<IAccount | null> {
    const verifyAccount = userModel.findOneAndUpdate(
      { email },
      { verified: true },
      { new: true }
    );
    return verifyAccount;
  }
}

export default new UserDatasource();
