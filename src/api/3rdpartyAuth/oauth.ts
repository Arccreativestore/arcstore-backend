// src/services/auth/passportGoogleAuth.ts

import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { logger } from '../../config/logger';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  REFRESH_SECRETKEY,
  ACCESS_SECRETKEY,
} from '../../config/config';
import { UserDatasource } from '../../services/auth/datasource';
import { BadreqError } from '../errorClass';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { tokenModel } from '../../models/token';
import { tokenDataSource } from '../../services/tokens/dataSource';

const clientID = GOOGLE_CLIENT_ID as string;
const clientSecret = GOOGLE_CLIENT_SECRET as string;
const callbackURL = GOOGLE_CALLBACK_URL as string;


class PassportGoogleAuth extends UserDatasource {
  
  init() {
    passport.use(
      new GoogleStrategy(
        {
          clientID,
          clientSecret,
          callbackURL,
          passReqToCallback: true, 
        },
        async (
          req: Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void
        ) => {
          try {
           
            const email: string = profile.emails?.[0].value as string;
            const emailVerified: boolean = profile.emails?.[0].verified || false;
            const firstName: string = profile.name?.givenName || '';
            const lastName: string = profile.name?.familyName || '';
            const profilePicture: string | null = profile.photos?.[0].value || null; 

            if (!email) {
              return done(new BadreqError('No email linked to this Google account'), null);
            }

            let user = await this.findByEmail(email);
            console.log(user)

            if (!user) {
              user = await this.userRegistration({
                email,
                firstName,
                lastName,
                profilePicture,
                role: 'USER',
                emailVerified,
                verifiedDate: emailVerified ? new Date() : undefined,
              });
              
              if (!user) {
                return done(new Error('Error signing up at this time'), null);
              }
            } 

          
            const payload = { id: user._id };
            const jwtAccessToken = jwt.sign(payload, ACCESS_SECRETKEY as string, { expiresIn: '1h' });
            const tokenId = crypto.randomBytes(16).toString('hex');
            const jwtRefreshToken = jwt.sign({ ...payload, tokenId }, REFRESH_SECRETKEY as string, { expiresIn: '7d' });
            const expiresAt = Date.now()+ 7 * 24 * 60 * 60 * 1000
            await new tokenDataSource().newToken(tokenId, user._id, expiresAt);

            
            const res = req.res as Response

            res.cookie('refreshToken', jwtRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              expires: new Date(expiresAt), // 7 days
            });
            //console.log('hello')
            return done(null, { accessToken: jwtAccessToken });
          } catch (err: any) {
            logger.error(`OAuth Error: ${err.message}`);
            return done(new Error('Authentication failed'), null);
          }
        }
      )
    );
  }
}

export default PassportGoogleAuth;
