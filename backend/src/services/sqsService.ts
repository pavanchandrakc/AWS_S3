import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const sqs = new AWS.SQS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL || '';

export const sendMessageToQueue = async (messageBody: object) => {
  if (!QUEUE_URL) {
    console.warn('AWS_SQS_QUEUE_URL is not defined. Skipping SQS message.');
    return;
  }

  const params = {
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: QUEUE_URL,
  };

  try {
    const result = await sqs.sendMessage(params).promise();
    console.log('Message sent to SQS:', result.MessageId);
    return result;
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    throw error;
  }
};

export default sqs;
