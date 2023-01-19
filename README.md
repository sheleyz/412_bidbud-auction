# BidBud Silent Auction Software

BidBud is a company that manages silent auctions for various organizations. Silent auctions are a typical fundraiser where a number of items are displayed in a physical space and bidders can move among the items and add their name to a physical sheet that allows them to outbid previous bidders. As you might expect, BidBud’s business model took a hit during the pandemic when in-person events were not possible. Therefore, BidBud wants to develop an electronic version of their silent auction system that will allow an auction to be conducted completely online.

You have been provided with the information for a sample auction of art items that will benefit the Indianapolis Zoo. This is the silent auction you will use to develop your software. 

This project includes:
- A model-view-controller Node/Express website that reads/writes information from the Firestore database
- A Firestore database that stores information about the auction items and users (a user is someone who has submitted a bid on an item)
- A subcollection within each auction item that stores information about the bids for that item
- A subcollection within each user that stores information about the bids that user has made
- A cloud function that sends an email to a bidder that confirms their bid, including the bid amount and the details of the auction item
- A cloud function that sends an SMS (text) message that confirms a bid has been made

- The website:
	- is hosted on App Engine
	- lists the items available in the auction and displays the details of a single auction item when selected
	- shows the current bid for each auction item
	- lists the auction items in order from smallest current bid to largest current bid
	- shows the auction items in a gallery-style layout (using the images for each auction item)
	- shows the current amount raised (the sum of all of the items' highest bids)
	- allows a viewer to view information about all bidders and details about one specific bidder (including a list of all of the bids that user has made)
	- implements Passport.js to allow users to log in to the site with their Google account credentials. These credentials will be stored in the users collection in Firestore. Only logged-in users are able to bid on auction items
	- has a form on the auction item page that allows a bidder to input a new bid for the selected item

- Note: Each auction item starts at $0. Bids are in $10 increments.
