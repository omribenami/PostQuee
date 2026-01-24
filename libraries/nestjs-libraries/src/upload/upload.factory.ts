import { CloudflareStorage } from './cloudflare.storage';
import { IUploadProvider } from './upload.interface';
import { LocalStorage } from './local.storage';

export class UploadFactory {
  static createStorage(): IUploadProvider {
    const storageProvider = process.env.STORAGE_PROVIDER || 'local';

    switch (storageProvider) {
      case 'local':
        // Default to ./uploads directory if UPLOAD_DIRECTORY is not set
        const uploadDir = process.env.UPLOAD_DIRECTORY || './uploads';
        return new LocalStorage(uploadDir);
      case 'cloudflare':
        return new CloudflareStorage(
          process.env.CLOUDFLARE_ACCOUNT_ID!,
          process.env.CLOUDFLARE_ACCESS_KEY!,
          process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
          process.env.CLOUDFLARE_REGION!,
          process.env.CLOUDFLARE_BUCKETNAME!,
          process.env.CLOUDFLARE_BUCKET_URL!
        );
      default:
        throw new Error(`Invalid storage type ${storageProvider}`);
    }
  }
}
