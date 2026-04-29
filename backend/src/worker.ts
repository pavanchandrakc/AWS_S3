import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const sqs = new AWS.SQS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL || '';

async function processMessage(message: AWS.SQS.Message) {
  try {
    const body = JSON.parse(message.Body || '{}');
    console.log('-------------------------------------------');
    console.log(`[${new Date().toISOString()}] Processing file:`, body.fileName);
    console.log('Action:', body.action);
    console.log('File ID:', body.fileId);
    console.log('S3 Key:', body.s3Key);
    
    // Simulate some work (e.g., image processing, virus scan)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Processing complete for:', body.fileName);
    console.log('-------------------------------------------');

    // Delete the message from the queue after successful processing
    await sqs.deleteMessage({
      QueueUrl: QUEUE_URL,
      ReceiptHandle: message.ReceiptHandle!
    }).promise();
    
    console.log('Message deleted from queue.');
  } catch (error) {
    console.error('Error processing message:', error);
  }
}

export async function startWorker() {
  if (!QUEUE_URL) {
    console.warn('⚠️ AWS_SQS_QUEUE_URL is not defined. Worker will not start.');
    return;
  }

  console.log('🚀 SQS Worker started. Polling for messages...');

  const params = {
    QueueUrl: QUEUE_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20 // Long polling
  };

  while (true) {
    try {
      const data = await sqs.receiveMessage(params).promise();
      
      if (data.Messages && data.Messages.length > 0) {
        for (const message of data.Messages) {
          await processMessage(message);
        }
      }
    } catch (error) {
      console.error('Error receiving messages:', error);
      // Wait a bit before retrying if there's an error
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
