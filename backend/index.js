const {Firestore} = require('@google-cloud/firestore');
require('dotenv').config()
const sgMail = require('@sendgrid/mail');

const firestore = new Firestore();

exports.processBid = async (message, context) => {

    const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

    const parsedMessage = JSON.parse(incomingMessage);    

    //console.log(`Document Data: ${JSON.stringify(parsedMessage)}`);    

    userData = {};

    userData.email = parsedMessage.email;
    userData.bid_amount = parsedMessage.value;
    userData.item_id = parsedMessage.itemID;

    itemData = {};

    itemData.email = parsedMessage.email;
    itemData.bid_amount = parsedMessage.value;
    itemData.item_id = parsedMessage.itemID;
    

    firestore.collection('users').doc(parsedMessage.email).collection('user_bids').doc().add(userData);
    firestore.collection('auction_items').doc(parsedMessage.itemID).set(itemData);
    firestore.collection('auction_items').doc(parsedMessage.itemID).update({'current_bid': Firestore.FieldValue.increment(10)});    

    // API KEY
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Prep Email

    const mailText = "A new bid has been made for $" + parsedMessage.value + " on item: " + parsedMessage.itemID;

    const msg = {
        to: parsedMessage.email,
        from: process.env.SENDGRID_SENDER,
        subject: "New Bid Made - BidBud",
        text: mailText,
        html: mailText
    };

    // Send Email
    sgMail
    .send(msg)
    .then(() =>{}, error => {
        console.error(error);
    });
    
  };