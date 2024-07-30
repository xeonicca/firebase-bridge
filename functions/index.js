/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const { onObjectFinalized } = require("firebase-functions/v2/storage")
const path = require('path');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

admin.initializeApp();
const storage = new Storage();

exports.makeFilePublic = onObjectFinalized({
  region: "asia-east1",
}, async (event) => {
  const filePath = event.data.name;
  const fileName = path.basename(filePath);
  const bucketName = event.data.bucket;

  logger.info(`File uploaded: ${filePath}`);
  logger.info(`Bucket: ${bucketName}`);


  if (!filePath) {
    logger.info('No file found.');
    return null;
  }

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);

  try {
    await file.makePublic();
    logger.info(`gs://${bucketName}/${filePath} is now public.`);
    await file.setMetadata({
      cacheControl: 'no-store',
    });
    logger.info(`Metadata for gs://${bucketName}/${filePath} updated to no-store.`);
  } catch (error) {
    logger.error('Error updating file');
  }
});