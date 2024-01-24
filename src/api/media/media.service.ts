import { HttpException, Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, ObjectCannedACL, S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private s3: S3;
  private bucketName: string;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      endpoint: this.configService.get('S3_ENDPOINT'),
      region: this.configService.get('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('S3_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET'),
      },
    });

    this.bucketName = this.configService.get('S3_BUCKET_NAME');
  }

  async uploadFile(files: Array<Express.Multer.File>): Promise<any> {
    try {
      const signedUrlsPromises = files.map(async (file) => {
        const id = uuidv4 + file.originalname;
        const params = {
          Bucket: this.bucketName,
          Key: id,
          Body: file.buffer,
          ACL: 'private' as ObjectCannedACL,
          ContentType: file.mimetype,
          signatureVersion: 'v4', //must use v4 because default is v2, which have problems when signing url
        };
        /* specify allowed command for signed url.
        e.g. This way FE must use only get method for S3 bucket. */
        const command = new GetObjectCommand(params);

        await this.s3.putObject(params);
        return getSignedUrl(this.s3, command, { expiresIn: 300 });
      });
      const signedUrls = await Promise.all(signedUrlsPromises);
      return signedUrls;
    } catch (error) {
      throw new HttpException(
        error.Code || error.message,
        error['$metadata']?.httpStatusCode || error.status,
      );
    }
  }
}
