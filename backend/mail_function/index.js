const {Firestore} = require('@google-cloud/firestore');
const sgMail = require('@sendgrid/mail');

const firestore = new Firestore();

exports.sendMail = async (event, context) => {      

    userBid = {};

    userBid.email = event.value.fields.email.stringValue;
    userBid.bid_amount = event.value.fields.bid_amount.stringValue;
    userBid.item_id = event.value.fields.itemID.stringValue;            

    // API KEY
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Prep Email

    const mailText = "A new bid has been made for $" + userBid.bid_amount + " on item: " + userBid.item_id;

    const msg = {
        to: userBid.email,
        from: process.env.SENDGRID_SENDER,
        subject: "New Bid Made - BidBud",
        text: mailText,
        html: mailText
    };

    console.log(`Message: ${msg}`);

    // Send Email
    sgMail
    .send(msg)
    .then(() =>{}, error => {
        console.error(error);
    });
    
  };