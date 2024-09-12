import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { logger } from '../../config/logger';
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from '../../config/config'
import {UserDatasource} from '../../services/user/datasource'
import { BadreqError } from '../errorClass';
const clientID = GOOGLE_CLIENT_ID as string
const clientSecret = GOOGLE_CLIENT_SECRET as string


// Define the function for setting up Google authentication strategy
class passportGoogleAuth extends UserDatasource {
  async googleOauth(){
passport.use(new GoogleStrategy({
 clientID,
 clientSecret,
 callbackURL: "http://localhost:3000/api/v1/auth/google/callback",
},

async (GaccessToken: string, GrefreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
      try {
        const email: string = profile.emails?.[0].value as string;
        const username: string = profile.displayName;
        const profilePicture: string | null = profile.photos?.[0].value || null;
    
        if(!email)
        {
        return done(new BadreqError('There is no Email linked to this google account'), null)
        }
   
        const splitName = username.toString().split(" ");
        const firstName = splitName[0] || '';
        const lastName = splitName.slice(1).join(" ") || '';
        
        const existingUser = await this.findByEmail(email);

        if (!existingUser) {
        const newAccount = await this.userRegistration({
        email,
        firstName,
        lastName,
        profilePicture,
        role: 'USER', 
        emailVerified: true ,
        verifiedDate: new Date()
        });

        if (newAccount) {
        const payload = {
        id: newAccount._id
         };

        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRETKEY as string, { expiresIn: '1hr' });
        return done(null,  {user:{accessToken,  statusCode: 202}} ); 
        }
        return done(new Error('Error signing up at this time'), null); 
         } else {
         const payload = { id: existingUser._id };
                    
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRETKEY as string, { expiresIn: '1hr' });
        return done(null, { user:{accessToken, statusCode: 200} } );
        }
        } catch (err: any) {
        logger.error(`Registration Error at the OAuth service: ${err.message}`);
        return done(err, null);
        }
}));
  }
};

export default passportGoogleAuth;
