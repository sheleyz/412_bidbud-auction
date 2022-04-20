// Importing auction item array
require('./array.js');

// Import Firestore
const {Firestore} = require('@google-cloud/firestore');

// Firestore Instance
const firestore = new Firestore();

// Define the setup function
async function setupDatabase() {   

  // Each element of the teachersArray is a JSON object.
  itemArray.forEach(async item => {

    // Get String of item ID
    itemIDString = (item.id).toString();
    
    // Create custom JSON for auction item    
    itemObject = getItemObject(item);
    
    // Add the auction item to the database
    await firestore.collection('auction_items').doc(itemIDString).set(itemObject)           
    
  }); 
  
  const bidObject = getBidInfoObject();

  await firestore.collection('bid_info').doc('totals').set(bidObject)
  
}

// Helpers

const getItemObject = (item) => {    
   
    // Create a JSON object for item data
    itemData = {};
    
    itemData.artist = item.artist;
    itemData.title = item.title;
    itemData.medium = item.medium;
    itemData.size = item.size;
    itemData.description = item.description;
    itemData.about_artist = item.about_artist;
    itemData.current_bid = 0;
    itemData.bid_total = 0;
    
    return itemData;
}

const getBidInfoObject = () => {    
   
    // Create a JSON object for bid data
    bidData = {};    
    
    bidData.bid_total = 0;
    
    return bidData;
}


// Main Call
setupDatabase();