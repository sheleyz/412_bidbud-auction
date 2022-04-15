var express = require('express');
var router = express.Router();

// Import the Node.js library
const { Firestore } = require('@google-cloud/firestore');

// Get an instance of Firestore
const firestore = new Firestore();

// // Middleware to report authentication status
// const ensureAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         // authenticated
//         next();
//     } else {
//         res.sendStatus(401);
//     }
// }

/* GET listing of all auction items. */
router.get('/', async (req, res, next) => {
    // Get a snapshot that represents all auction items
    const auctionItemsSnapshot = await firestore.collection('auction_items').get();

    // Make a local array of auction items
    auctionItems = [];
    auctionItemsSnapshot.forEach(item => {
        // console.log(`Artist name: ${item.data().artist} - Item title: ${item.data().title}`);

        // Create a local auction item object
        auctionItem = item.data();
        auctionItem.id = item.id;
        auctionItems.push(auctionItem);
    });

    res.render('index', { title: "BidBud", itemlist: auctionItems });
});

/* GET view of a single auction item. */
router.get('/view', async (req, res, next) => {
    // Get a snapshot that represents a single auction item
    const auctionItemSnapshot = await firestore.collection('auction_items').doc(req.query.id).get();
    const itemBidsSnapshot = await firestore.collection('auction_items').doc(req.query.id).collection('bids').get();

    console.log(`Auction Item ID: ${auctionItemSnapshot.id}`);
    console.log(`Auction Item title: ${auctionItemSnapshot.data().title}`);

    // // Loop through the snapshot and write out the title of each item
    // auctionItemSnapshot.forEach(item => {
    //     console.log(`Auction Item ID: ${item.id}`);
    //     console.log(`Auction Item title: ${item.data().title}`);

    //     // Create a local auction item object
    //     auctionItem = item.data();
    //     auctionItem.id = item.id;
    //     auctionItems.push(auctionItem);
    // });

    // Make a local array of auction item bids
    itemBids = [];
    auctionItemsSnapshot.forEach(bid => {
        console.log(`Bidder email: ${bid.data().email} - Bid amount: ${bid.data().amount}`);

        // Create a local auction item bid object
        itemBid = bid.data();
        itemBids.push(itemBid);
    });

    res.render('view', { itemid: auctionItemSnapshot.id, artist: auctionItemSnapshot.data().artist, title: auctionItemSnapshot.data().title, medium: auctionItemSnapshot.data().medium, size: auctionItemSnapshot.data().size, description: auctionItemSnapshot.data().description, aboutartist: auctionItemSnapshot.data().about_artist, bidlist: itemBids });
});

module.exports = router;
