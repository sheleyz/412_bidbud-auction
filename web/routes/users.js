require('dotenv').config();
var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('../services/passport_google');
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

/* GET user profile. */
router.get('/', async function (req, res, next) {
    // If a user is logged in, show their info
    if (req.isAuthenticated()) {
        loggedInUser = req.user;
        console.log(loggedInUser);

        // Get user's bids
        const userBidsSnapshot = await firestore.collection('users').doc(req.user.email).collection('bids').orderBy('amount', 'desc').get();

        // Make a local array of auction item bids
        userBids = [];
        userBidsSnapshot.forEach(bid => {
            // Create a local auction item bid object
            userBid = bid.data();
            userBids.push(userBid);
        });

        res.render('users/user-profile', {
            displayName: loggedInUser.displayName,
            email: loggedInUser.email,
            userImage: loggedInUser.picture,
            userBidList: userBids
        });
    } else {
        res.render('users/user-noprofile');
    }
});

/* GET to Google login screen. */
router.get('/login',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

/* GET to logout function. */
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) return next(err);
        return res.redirect('/users');
    });
});

/* GET for Google return. */
router.get('/return',
    passport.authenticate('google', { failureRedirect: '/users/login' }),
    function (req, res) {
        res.redirect('/users');
    }
);

module.exports = router;
