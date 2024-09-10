import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {VERIFY_SECRETKEY}from '../config/config'
import { BadreqError } from './errors';

export const jwtVerify = (token: string | null) => {
 

  if (!token) {
    throw new BadreqError('Token not included')
  }

  try {
    const decoded = jwt.verify(token, VERIFY_SECRETKEY as string);
    return decoded 
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
     throw new Error( 'token has expired' );
    } else if (err instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Internal server error');
    }
  }
};


