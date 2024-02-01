import { HttpException, Inject, Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, ObjectCannedACL, S3 } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivateFile, User } from '../users/index.entity';

@Injectable()
export class MediaService {
  private readonly s3: S3;
  private bucketName: string;
  constructor(
    private readonly configService: ConfigService,
    @Inject('S3_PROVIDER') private readonly s3Provider: S3,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(PrivateFile) private fileRepo: Repository<PrivateFile>,
  ) {
    this.s3 = s3Provider;
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
    /* user is the alias for the User entity.
    files is the alias for the files relation in the User entity */
    const userWithFiles = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.files', 'files')
      .where('user.id = :ownerId', { ownerId })
      .select(['user.id', 'files'])
      .getOne();
    // const userWithFiles = await this.userRepo.findOne({
    //   where: { id: ownerId },
    //   relations: ['files'],
    //   select: { id: true, files: true },
    // });
    return userWithFiles;
  }

  public async deleteFiles(filesKeys: string[]) {
    const deleteOperation = filesKeys.map(async (key) => {
      await this.s3.deleteObject({ Bucket: this.bucketName, Key: key });
      await this.fileRepo.delete({ key: key });
    });
    await Promise.all(deleteOperation);
  }

  public async uploadFiles(
    files: Array<Express.Multer.File>,
    ownerId: User['id'],
  ): Promise<any> {
    const fileObjects = files.map((file) => ({
      key: uuidv4() + file.originalname,
      buffer: file.buffer,
      owner: ownerId,
      mimetype: file.mimetype,
    }));
    try {
      const signedUrlsPromises = fileObjects.map(async (file) => {
        const params = this.createParams(
          this.bucketName,
          file.key,
          file.buffer,
          'private',
          file.mimetype,
        );
        /* specify allowed command for signed url.
        e.g. This way FE must use only specified route method(get in this case)
         for S3 bucket. */
        const command = new GetObjectCommand(params);
        await this.s3.putObject(params);
        await this.fileRepo.insert({
          key: file.key,
          owner: {
            id: ownerId,
          },
          mimetype: file.mimetype,
        });
        return getSignedUrl(this.s3, command, { expiresIn: 300 });
      });
      return await Promise.all(signedUrlsPromises);
    } catch (error) {
      //any error occurs delete from db and s3 to preserve data consistency
      const deleteOperation = fileObjects.map(async (file) => {
        await this.s3.deleteObject({ Bucket: this.bucketName, Key: file.key });
        await this.fileRepo.delete({ key: file.key });
      });
      await Promise.all(deleteOperation);

      throw new HttpException(
        error.Code || error.message,
        error['$metadata']?.httpStatusCode || error.status,
      );
    }
  }
}
