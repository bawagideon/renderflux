import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'renderflux-pdfs';
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

// Initialize S3 Client for Cloudflare R2
const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || '',
        secretAccessKey: R2_SECRET_ACCESS_KEY || '',
    },
});

// RENAMED from uploadPdf -> uploadToR2 to match worker.ts call
export const uploadToR2 = async (
    buffer: Buffer,
    filename: string,
    mimeType: string = 'application/pdf' // Default to PDF, but allow 'image/png'
): Promise<string> => {
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
        console.warn('R2 credentials missing. Skipping upload.');
        return '';
    }

    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: mimeType, // Use dynamic mime type
        });

        await s3Client.send(command);

        // Use Public Domain if available
        if (R2_PUBLIC_DOMAIN) {
            const cleanDomain = R2_PUBLIC_DOMAIN.replace(/\/$/, '');
            return `${cleanDomain}/${filename}`;
        }

        // Fallback URL
        return `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${filename}`;
    } catch (error) {
        console.error('Failed to upload file to R2:', error);
        throw error;
    }
};