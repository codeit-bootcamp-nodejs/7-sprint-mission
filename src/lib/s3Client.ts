import { S3Client } from "@aws-sdk/client-s3";
import { ASW_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, NODE_ENV } from "./constants";

const s3Client = 
NODE_ENV === 'production'
? new S3Client({
    region: ASW_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
    })
   : null;

export default s3Client;