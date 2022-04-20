const sgMail = require('@sendgrid/mail');

exports.sendMail = (event, context) => {
    
    userBid = {};

    userBid.email = event.value.fields.email.stringValue;
    userBid.bid_amount = event.value.fields.bid_amount.stringValue;
    userBid.item_id = event.value.fields.itemID.stringValue;

    // API KEY
    sgMail.setApiKey('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');

    // Prep Email

    const mailText = "A new bid has been made for $" + userBid.bid_amount + " on Item " + userBid.item_id;    
    
    
    const msg = {
        to: userBid.email,
        from: 'sethwhee@iu.edu',
        subject: "BidBud - New Bid Made",
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