var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {
        // Create a user object
        const newUser = {
            provider: 'Google',
            providerID: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            providerProfile: profile
        }

        await firestore.collection('users').doc(newUser.email).set(newUser);
        cb(null, newUser);
    })
);

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});