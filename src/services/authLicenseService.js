import { constants, createCipheriv, createPrivateKey, generateKeyPairSync, randomBytes, sign } from 'crypto';
import License from '../models/License.js';
import Payment from '../models/Payment.js';
import Plan from '../models/Plan.js';


import { MongoClient } from 'mongodb';


const uri = "mongodb+srv://zfintechpvtltd:sMCG5UFvbXzdHrVK@cluster0.zvosn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Example: MongoDB URI for local development
const dbName = 'keys'; // Replace with your database name
const collectionName = 'private_keys'; // The collection where keys will be stored

// MongoDB client initialization
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const AES_KEY = Buffer.from('08bfb5a91d43c4d48600fee85fed9cfe52f945dcca1533a328cd2a1b1ef2942f', 'hex');

// Path variable not needed now, since we're storing keys in DB
// const path = '/tmp/private_key.pem';

async function loadOrGeneratePrivateKey() {
    let privateKey;

    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Check if the private key already exists in the database
        const existingKey = await collection.findOne({ keyName: 'privateKey' });

        if (existingKey) {
            // If private key exists, load it
            privateKey = createPrivateKey(existingKey.privateKey);
            console.log("Loaded existing private key from MongoDB.");
        } else {
            // If no key exists, generate a new one
            console.log("No private key found. Generating a new one...");

            const { privateKey: newPrivateKey, publicKey } = generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicExponent: 65537,
            });

            const privatePem = newPrivateKey.export({
                type: 'pkcs8',
                format: 'pem',
            });

            // Save the private key to MongoDB
            await collection.insertOne({
                keyName: 'privateKey',
                privateKey: privatePem.toString('utf8'), // Save the private key in PEM format
                createdAt: new Date(),
            });
            console.log("Generated and saved new private key to MongoDB.");

            // You can also save the public key if needed
            const publicPem = publicKey.export({
                type: 'spki',
                format: 'pem',
            });

            await collection.insertOne({
                keyName: 'publicKey',
                publicKey: publicPem.toString('utf8'),
                createdAt: new Date(),
            });
            console.log("Public key saved to MongoDB.");

            privateKey = newPrivateKey;
        }
    } catch (error) {
        console.error('Error loading or generating private key:', error);
    } finally {
        // Ensure MongoDB connection is closed after the operation
        await client.close();
    }

    return privateKey;
}




function encryptData(data) {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', AES_KEY, iv);
    cipher.setAutoPadding(false); // Critical: Disable PKCS7 padding
    
    // Manual null-byte padding to match Python
    const paddingLength = (16 - (data.length % 16)) % 16;
    const paddedData = Buffer.concat([data, Buffer.alloc(paddingLength, 0)]);
    
    return Buffer.concat([
        iv,
        cipher.update(paddedData),
        cipher.final()
    ]);
}

let PRIVATE_KEY;

async function ensurePrivateKeyInitialized() {
    if (!PRIVATE_KEY) {
        PRIVATE_KEY = await loadOrGeneratePrivateKey();
    }
    return PRIVATE_KEY;
}

async function generateLicense(hardware_id, start_date, expiration_date, transactionId, plan_id, user_id) {
  try {
    const privateKey = await ensurePrivateKeyInitialized();

    // Validate input parameters
    if (!hardware_id || !plan_id || !transactionId) {
      return { success: false, message: 'Hardware ID, Plan ID, and Transaction ID are required' };
    }

    // Check for existing hardware ID
    const checkExistingHardware = await License.findOne({ hardware_id });
    if (checkExistingHardware) {
      return { success: false, message: 'Hardware ID is already registered' };
    }

    // Validate plan_id (must be a valid ObjectId)
    const plan = await Plan.findById(plan_id);
    if (!plan) {
      return { success: false, message: 'Invalid Plan ID' };
    }

    // Validate transactionId (assuming Payment model has transactionId as a String)
    const checkPayment = await Payment.findOne({ transactionId });
    if (!checkPayment) {
      return { success: false, message: 'Transaction is not completed!' };
    }

    const planDurationInDays = Number(plan.duration);
    if (isNaN(planDurationInDays) || planDurationInDays <= 0) {
      return { success: false, message: 'Invalid Plan Duration' };
    }

    // Set start date (default to now if not provided)
    const startDateObj = start_date ? new Date(start_date) : new Date();
    if (isNaN(startDateObj.getTime())) {
      return { success: false, message: 'Invalid Start Date format. Use YYYY-MM-DD or a valid date string.' };
    }

    // Calculate expiration date based on plan duration
    const expirationDateObj = new Date(startDateObj);
    expirationDateObj.setDate(startDateObj.getDate() + planDurationInDays);

    // Prepare license data
    const licenseData = JSON.stringify({
      hardware_id,
      plan_id,
      start_date: startDateObj.toISOString().split('T')[0],
      expiration_date: expirationDateObj.toISOString().split('T')[0],
      plan_name: plan.name,
      plan_duration: plan.duration,
      plan_price: plan.price,
    });

    // Generate RSA-PSS signature
    const signature = sign('sha256', Buffer.from(licenseData), {
      key: privateKey,
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: 32,
    });

    const signatureLength = Buffer.alloc(4);
    signatureLength.writeUInt32BE(signature.length, 0);

    const dataPackage = Buffer.concat([signatureLength, signature, Buffer.from(licenseData)]);

    const encryptedPackage = encryptData(dataPackage);
    const licenseKey = encryptedPackage.toString('base64');

    // Calculate days left
    const now = new Date();
    const daysLeft = Math.ceil((expirationDateObj - now) / (1000 * 60 * 60 * 24));

    // Save to database
    const license = new License({
      hardware_id,
      user_id,
      plan_id,
      isgeneratedLicense: 'Yes',
      transactionId: checkPayment.transactionId, // Use transactionId as per updated schema
      license_key: licenseKey,
      start_date: startDateObj.toISOString().split('T')[0],
      expiration_date: expirationDateObj.toISOString().split('T')[0],
      days_left: daysLeft > 0 ? daysLeft : 0,
      duration_days: planDurationInDays.toString(), // Added to match schema
      createdAt: now,
    });
    await license.save();

    return {
      success: true,
      licenseKey,
      hardware_id,
      start_date: startDateObj.toISOString().split('T')[0],
      expiration_date: expirationDateObj.toISOString().split('T')[0],
      plan_name: plan.name,
      plan_duration: plan.duration,
      plan_price: plan.price,
      days_left: daysLeft > 0 ? daysLeft : 0,
      transactionId: checkPayment.transactionId,
    };
  } catch (error) {
    console.error('License generation error:', error);
    return { success: false, message: `Error generating license: ${error.message}` };
  }
}

export { generateLicense };





