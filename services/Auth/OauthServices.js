const authRepo = require("../../repositories/Auth/authRepo")
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwt = require('jsonwebtoken')
const verifyEmail = require("../../utils/verifyAccountMail")
const env = require('dotenv').config()

const passportAuth = async () => {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/v1/auth/google/callback",
    },
        async (GaccessToken, GrefreshToken, profile, done) => {
            try {

                const email = profile.emails[0].value;
                const username = profile.displayName;
                const profilePicture = profile.photos[0].value
                
                const existingUser = await authRepo.findEmail(email);
                
                if (!existingUser) {

                    const newAccount = await authRepo.newAccount({
                        email,
                        username,
                        profilePicture
                    })
                   
                    if (newAccount) {
                        const payload = {
                            id: newAccount.id
                        }

                        const mailtoken = jwt.sign(payload, process.env.ACCESS_SECRETKEY, { expiresIn: '1hr' })
                        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRETKEY, { expiresIn: '1hr' })
                        await verifyEmail(username, mailtoken, email)
                        return done(null, {user: newAccount, accessToken} );
                    }
                }
                else
                {
                    const payload = { id: existingUser.id };
                    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRETKEY, { expiresIn: '15m' });
                    return done(null, { user: existingUser, accessToken });
                }

            } catch (err) {
                logger.error(`Registeration Error at the Oauth service: ${err.message}`)
                return done(err, null);
            }
        }));

}
module.exports = passportAuth