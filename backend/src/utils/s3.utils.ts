import type { Readable } from "stream";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import "dotenv/config";

const {
  BUCKET_ENDPOINT,
  BUCKET_REGION,
  BUCKET_NAME,
  BUCKET_ACCESS_KEY,
  BUCKET_SECRET_KEY,
  BASE_URL,
} = process.env;

const s3 = new S3Client({
  endpoint: BUCKET_ENDPOINT,
  region: BUCKET_REGION || "auto",
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY!,
    secretAccessKey: BUCKET_SECRET_KEY!,
  },
  forcePathStyle: false,
});

export const uploadToS3 = async (
  key: string,
  buffer: Buffer,
  mimetype: string,
): Promise<string> => {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    }),
  );
  return `${BASE_URL}/auth/avatar/${key}`;
};

export const getFromS3 = async (
  key: string,
): Promise<{ stream: Readable; contentType: string }> => {
  const response = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }),
  );
  return {
    stream: response.Body as Readable,
    contentType: response.ContentType ?? "application/octet-stream",
  };
};

export const deleteFromS3 = async (url: string): Promise<void> => {
  const proxyPrefix = `${BASE_URL}/auth/avatar/`;
  const s3Prefix = `${BUCKET_ENDPOINT}/${BUCKET_NAME}/`;
  const key = url.startsWith(proxyPrefix)
    ? url.slice(proxyPrefix.length)
    : url.startsWith(s3Prefix)
      ? url.slice(s3Prefix.length)
      : null;
  if (!key) return;
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
};
