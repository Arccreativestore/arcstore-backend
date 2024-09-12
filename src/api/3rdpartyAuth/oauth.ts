import datasource from '../../services/user/datasource';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { logger } from '../../config/logger';
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} from '../../config/config'

const clientID = GOOGLE_CLIENT_ID as string
const clientSecret = GOOGLE_CLIENT_SECRET as string


// Define the function for setting up Google authentication strategy
const passportAuth = (): void => {
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
                let firstName = ''
                let lastName = ''
                const nameParts: Array<string> = username.split(" ")

                if (nameParts.length === 1) {
                    // In case the user only has one name
                    firstName = nameParts[0];
                  } else if (nameParts.length > 1) {
                    firstName = nameParts[0];
                    // Join the rest of the name parts in case there are multiple words in the last name
                    lastName = nameParts.slice(1).join(' ');
                  }


                const existingUser = await datasource.findByEmail(email);

                if (!existingUser) {
                    const newAccount = await datasource.userRegistration({
                        email,
                        firstName,
                        lastName,
                        profilePicture,
                        role: 'USER', // default
                        emailVerified: true ,// true for o-auth
                        verifiedDate: new Date()
                    });

                    if (newAccount) {
                        const payload = {
                            id: newAccount._id
                        };

                        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRETKEY as string, { expiresIn: '1hr' });
                        return done(null, { user: payload, accessToken }); // look into
                    }
                } else {
                    const payload = { id: existingUser._id };
                    
                    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRETKEY as string, { expiresIn: '1hr' });
                    return done(null, { user: payload, accessToken });
                }
            } catch (err: any) {
                logger.error(`Registration Error at the OAuth service: ${err.message}`);
                return done(err, null);
            }
        }));
};

export default passportAuth;
