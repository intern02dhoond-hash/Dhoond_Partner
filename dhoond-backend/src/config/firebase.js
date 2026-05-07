const admin = require("firebase-admin");

// NOTE: You need to download your service account key from:
// Firebase Console > Project Settings > Service Accounts > Generate New Private Key
// Save it as 'firebase-service-account.json' in your root folder.

const serviceAccount = require("../../firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Use the Project ID from your config
  projectId: "dhoond-auth-app" 
});
   
module.exports = admin;