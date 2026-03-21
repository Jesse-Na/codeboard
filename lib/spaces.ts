import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
	endpoint: process.env.SPACES_ENDPOINT, // https://tor1.digitaloceanspaces.com
	region: process.env.SPACES_REGION, // tor1
	credentials: {
		accessKeyId: process.env.SPACES_KEY!,
		secretAccessKey: process.env.SPACES_SECRET!,
	},
});
