require('dotenv').config();
const { cert } = require('firebase-admin/app');

try {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  console.log("Original start:", privateKey.substring(0, 30));
  console.log("Original end:", privateKey.substring(privateKey.length - 30));
  console.log("Includes literal \\n:", privateKey.includes('\\n'));
  console.log("Includes actual \\n:", privateKey.includes('\n'));
  
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }
  privateKey = privateKey.replace(/^"|"$/g, '');

  console.log("Processed start:", privateKey.substring(0, 30));
  console.log("Processed end:", privateKey.substring(privateKey.length - 30));

  cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  });
  console.log("CERT PARSED SUCCESSFULLY");
} catch (e) {
  console.error("ERROR:", e.message);
}
