const AWS = require('aws-sdk');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();
const uploadMulter = multer({ storage });

// Configure multer to use S3 storage
const uploadFileToS3 = async (file, fieldName) => {
  const key = `uploads/${fieldName}/${Date.now()}_${file.originalname}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    return { key, location: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` };
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

const uploadMultiple = uploadMulter.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'titleImage', maxCount: 1 },
  { name: 'pitchDeck', maxCount: 1 }, // Allows up to 3 other documents
]);

const uploadFiles = async (req) => {
  const files = req.files;
  const uploadResults = [];

  // Iterate through each field and upload its files
  for (const fieldName in files) {
    for (const file of files[fieldName]) {
      const result = await uploadFileToS3(file, fieldName);
      uploadResults.push({ fieldName, ...result });
    }
  }
  return uploadResults;
}
module.exports = {
  uploadMulter,
  uploadMultiple,
  uploadFileToS3,
  uploadFiles
}