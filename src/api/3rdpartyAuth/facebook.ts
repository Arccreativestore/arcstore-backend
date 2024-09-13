import passport from "passport";
import {Strategy as FacebookStrategy, Profile}  from 'passport-facebook'
import { FACEBOOK_APP_SECRET, FACEBOOK_APP_ID, ACCESS_SECRETKEY, REFRESH_SECRETKEY } from "../../config/config";
import { UserDatasource } from "../../services/user/datasource";
import { BadreqError } from "../errorClass";
import jwt from 'jsonwebtoken'
import { logger } from "../../config/logger";


class FacebookAuth extends UserDatasource{
async facebookAuth()
{
    
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID as string,
    clientSecret: FACEBOOK_APP_SECRET as string,
    callbackURL: 'http://localhost:3000/api/v1/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'name', 'photos'],
    scope: ['email']
  },
  async(FaccessToken: string, FrefreshToken: string, profile: Profile, done: (error: any, user: any) => void ) =>{
  
    try {
    const email: string | undefined = profile.emails?.[0].value as string
    const name = profile.name || profile.displayName
    const profilePicture: string | undefined = profile.photos?.[0].value as string
    
    if(typeof email == 'undefined') return done(new BadreqError('There is no email linked to this account'), null)

    const splitName = name.toString().split(" ");
    const firstName = splitName[0] || '';
    const lastName = splitName.slice(1).join(" ") || '';
    const userExist =  await this.findByEmail(email)
      
    if(!userExist)
    {
        const newUser = await this.userRegistration(
            {
                email: email,
                firstName,
                role: 'USER',
                lastName,
                profilePicture,
                emailVerified: true,
                verifiedDate: new Date()
            }
        )
     const accessToken = jwt.sign({_id: newUser?._id}, ACCESS_SECRETKEY as string, {expiresIn : '1hr'})
     const refreshToken = jwt.sign( {_Id: newUser?._id}, REFRESH_SECRETKEY as string, { expiresIn: "7d" }); 
     return newUser ? done(null,  {user:{accessToken, refreshToken, statusCode: 202}}) : done(new Error('Error Signing up at this time'), null)
    }
    else{
        const accessToken = jwt.sign({_id: userExist._id}, ACCESS_SECRETKEY as string, {expiresIn : '1hr'})
        const refreshToken = jwt.sign( {_Id: userExist?._id}, REFRESH_SECRETKEY as string, { expiresIn: "7d" }); 
        return done(null, {user:{accessToken, refreshToken, statusCode: 200}})
    }
    } catch (error) {
        logger.error(error)
        throw error
    }
}));
}
}

export default FacebookAuth