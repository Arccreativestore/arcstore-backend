import Base from "../../base";
import { ACCESS_SECRETKEY, VERIFY_SECRETKEY } from "../../config/config";
import { ErrorHandlers } from "../../helpers/errorHandler";
import jwt from 'jsonwebtoken'

class RefreshToken extends Base
{
    generateToken(_: any, {data}: {data:{refreshToken: string}}): {accessToken: string}{

    const {refreshToken} = data
    if(!refreshToken) throw new ErrorHandlers().ValidationError('Token not Found in Request')
    const verify = this.decodeRefresh(refreshToken)
    const payload: any = this.isTokenExpired(verify)
    if(payload) throw new ErrorHandlers().AuthenticationError('Refresh Token expired, Please Login To Proceed')
    const accessToken = jwt.sign({_id: payload._id}, ACCESS_SECRETKEY as string, {expiresIn: '1hr'})
    return {accessToken}
    }
}

export const tokenMutation = {
        generateToken: (parent: any, args: any, context: any) => new RefreshToken().generateToken(parent, args)
};


export const tokenQuery = {
        Me: () => "Example kind" 
};