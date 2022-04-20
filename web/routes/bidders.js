var express = require('express');
var router = express.Router();

// Import the Node.js library
const { Firestore } = require('@google-cloud/firestore');

// Get an instance of Firestore
const firestore = new Firestore();

// Middleware to report authentication status
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // authenticated
        next();
    } else {
        res.sendStatus(401);
    }
}

/* GET listing of all bidders. */
router.get('/', async (req, res, next) => {
    // Get a snapshot that represents all bidders
    const biddersSnapshot = await firestore.collection('users').get();

    // Make a local array of bidders
    bidders = [];
    biddersSnapshot.forEach(user => {
        // Create a local bidder object
        bidder = user.data();
        bidders.push(bidder);
    });

    res.render('bidders/index', { title: "Bidders", biddersList: bidders });
});

/* GET view of a single bidder. */
router.get('/view', async (req, res, next) => {
    // Get a snapshot that represents a single bidder
    const bidderSnapshot = await firestore.collection('users').doc(req.query.email).get();

    // Get user's bids
    const userBidsSnapshot = await firestore.collection('users').doc(req.query.email).collection('bids').orderBy('amount', 'desc').get();

    // Make a local array of auction item bids
    userBids = [];
    userBidsSnapshot.forEach(bid => {
        // Create a local auction item bid object
        userBid = bid.data();
        userBids.push(userBid);
    });

    res.render('bidders/view', { displayName: bidderSnapshot.data().displayName, userImage: bidderSnapshot.data().picture, userBidList: userBids });
});

module.exports = router;
