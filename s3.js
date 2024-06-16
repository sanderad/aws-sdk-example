import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
} from "./config.js";

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

//object with file info
export const uploadFile = async (file) => {
  const stream = fs.createReadStream(file.tempFilePath);

  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream,
  };

  const command = new PutObjectCommand(uploadParams);

  return await client.send(command);
};

export const getFiles = async () => {
  const command = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME,
  });

  return await client.send(command);
};

export const getFile = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  });

  return await client.send(command);
};

export const downloadFile = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  });

  const result = await client.send(command);
  console.log(result);
  result.Body.pipe(fs.createWriteStream(`./downloads/${fileName}`));
};

export const getFileURL = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: fileName,
  });

  return await getSignedUrl(client, command, { expiresIn: 3600 });
};
