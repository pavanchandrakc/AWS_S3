import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: 'private',
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

export const downloadFromS3 = async (
  bucket: string,
  key: string
): Promise<Buffer> => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const result = await s3.getObject(params).promise();
    return result.Body as Buffer;
  } catch (error) {
    console.error('S3 download error:', error);
    throw error;
  }
};

export const deleteFromS3 = async (
  bucket: string,
  key: string
): Promise<void> => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw error;
  }
};

export const listS3Files = async (bucket: string, prefix?: string) => {
  const params: AWS.S3.ListObjectsV2Request = {
    Bucket: bucket,
  };

  if (prefix) {
    params.Prefix = prefix;
  }

  try {
    const result = await s3.listObjectsV2(params).promise();
    return result.Contents || [];
  } catch (error) {
    console.error('S3 list error:', error);
    throw error;
  }
};
 
export default s3;
