const accountSid = 'AC5849a95537fcf88d1c1a87fa897a04d5';
const authToken = '8619d11e1715ad2b0d2fcc3c56cba8c0';
const client = require('twilio')(accountSid, authToken);

exports.sendSMS = (event, context) => {    

    userInfo = {};
    
    try{
    userInfo.bid_amount = event.value.fields.amount.integerValue;
    userInfo.item_id = event.value.fields.itemID.stringValue;
    userInfo.phone_number = event.value.fields.phone_number.stringValue;
    }
    catch(err){
        console.log(err);
    }          

    const txtMsg = "A new bid has been made for $" + userInfo.bid_amount + " on Item #: " + userInfo.item_id + ". Link to item: " + "https://sp22-41200-final.uc.r.appspot.com/view?id=" + userInfo.item_id;     
    userInfo.phone_number = userInfo.phone_number.replace('(','').replace(')','').replace('-','');
    const toNumber = "+1" + userInfo.phone_number.replace('-','');        

    client.messages
    .create({
        body: txtMsg,
        from: '+19403145413',
        to: toNumber
    })
    .then(message => console.log(message.sid))    
    .catch(error => console.log(error));

};