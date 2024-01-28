import { HttpException, Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, ObjectCannedACL, S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivateFile, User } from '../users/index.entity';

@Injectable()
export class MediaService {
  private s3: S3;
  private bucketName: string;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(PrivateFile) private fileRepo: Repository<PrivateFile>,
  ) {
    this.s3 = new S3({
      endpoint: this.configService.get('S3_ENDPOINT'),
      region: this.configService.get('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('S3_KEY'),
        secretAccessKey: this.configService.get('S3_SECRET'),
      },
      maxAttempts: 5,
    });

    this.bucketName = this.configService.get('S3_BUCKET_NAME');
  }

  createParams(
    bucket: string,
    key: string,
    body: Express.Multer.File['buffer'],
    acl: ObjectCannedACL,
    contentType: Express.Multer.File['mimetype'],
  ) {
    return {
      Bucket: bucket,
      Key: key,
      Body: body,
      ACL: acl,
      ContentType: contentType,
      signatureVersion: 'v4', //must use v4 because default is v2, which have problems when signing url
    };
  }

  public async getUsersFiles(ownerId: User['id']) {
    const userWithFiles = await this.userRepo.findOne({
      where: { id: ownerId },
      relations: ['files'],
      select: { id: true, files: true },
    });
    return userWithFiles;
  }

  public async uploadFiles(
    files: Array<Express.Multer.File>,
    ownerId: User['id'],
  ): Promise<any> {
    try {
      const signedUrlsPromises = files.map(async (file) => {
        const key = uuidv4() + file.originalname;
        const params = this.createParams(
          this.bucketName,
          key,
          file.buffer,
          'private',
          file.mimetype,
        );
        /* specify allowed command for signed url.
        e.g. This way FE must use only specified route method(get in this case)
         for S3 bucket. */
        const command = new GetObjectCommand(params);
        await this.s3.putObject(params);
        const f = this.fileRepo.create({
          id: uuidv4(),
          key: uuidv4() + file.originalname,
          mimetype: file.mimetype,
          owner: { id: ownerId },
        });
        console.log(f);
        await this.fileRepo.insert(f);
        // await this.fileRepo.insert({
        //   key: key,
        //   owner: {
        //     id: ownerId,
        //   },
        //   mimetype: file.mimetype,
        // });
        return getSignedUrl(this.s3, command, { expiresIn: 300 });
      });
      return await Promise.all(signedUrlsPromises);
    } catch (error) {
      throw new HttpException(
        error.Code || error.message,
        error['$metadata']?.httpStatusCode || error.status,
      );
    }
  }
}
