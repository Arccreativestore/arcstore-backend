// src/services/auth/FacebookAuth.ts

import passport from 'passport';
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import {
  FACEBOOK_APP_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_CALLBACK_URL,
  ACCESS_SECRETKEY,
  REFRESH_SECRETKEY,
} from '../../config/config';
import { UserDatasource } from '../../services/auth/datasource';
import { BadreqError } from '../errorClass';
import jwt from 'jsonwebtoken';
import { logger } from '../../config/logger';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { tokenDataSource } from '../../services/tokens/dataSource';

class FacebookAuth extends UserDatasource {
  init() {
    passport.use(
      new FacebookStrategy(
        {
          clientID: FACEBOOK_APP_ID as string,
          clientSecret: FACEBOOK_APP_SECRET as string,
          callbackURL: FACEBOOK_CALLBACK_URL as string,
          profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
          scope: ['email'],
          passReqToCallback: true,
        },
        async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void
        ) => {
          try {
            const email: string | undefined = profile.emails?.[0].value;
            const firstName: string = profile.name?.givenName || '';
            const lastName: string = profile.name?.familyName || '';
            const profilePicture: string | null = profile.photos?.[0].value || null;
            const facebookId: string = profile.id;

            if (!email) {
              return done(new BadreqError('No email linked to this Facebook account'), null);
            }

           
            let user = await this.findByEmail(email);

            if (!user) {
              user = await this.userRegistration({
                email,
                firstName,
                lastName,
                profilePicture,
                role: 'USER',
                emailVerified: true,
                verifiedDate: new Date(),
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

           
            const res = req.res as Response;
            res.cookie('refreshToken', jwtRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              expires: new Date(expiresAt),
            });
            return done(null, { accessToken: jwtAccessToken });
          } catch (error: any) {
            logger.error(`OAuth Error: ${error.message}`);
            return done(new Error('Authentication failed'), null);
          }
        }
      )
    );
  }
}

export default FacebookAuth;
