import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import "dotenv/config";

const {
  BUCKET_ENDPOINT,
  BUCKET_REGION,
  BUCKET_NAME,
  BUCKET_ACCESS_KEY,
  BUCKET_SECRET_KEY,
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
  mimetype: string
): Promise<string> => {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );
  return `${BUCKET_ENDPOINT}/${BUCKET_NAME}/${key}`;
};

export const deleteFromS3 = async (url: string): Promise<void> => {
  const prefix = `${BUCKET_ENDPOINT}/${BUCKET_NAME}/`;
  if (!url.startsWith(prefix)) return;
  const key = url.slice(prefix.length);
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
};
