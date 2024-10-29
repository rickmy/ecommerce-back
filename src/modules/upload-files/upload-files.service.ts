import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { StorageClient } from '@supabase/storage-js';
import config from 'src/core/config';
import { FileNameDto } from './dto/file.dto';
import { Response } from 'express';

@Injectable()
export class UploadFilesService {
  private readonly storage = new StorageClient(config().URL_SUPABASE, {
    Authorization: `Bearer ${config().SERVICE_KEY}`,
    apiKey: config().SERVICE_KEY,
  });
  private readonly bucket = 'product-img';

  private readonly logger = Logger;

  async listBucket() {
    const { data, error } = await this.storage.listBuckets();
    if (error) {
      this.logger.error(error);
      throw error;
    }
    return data;
  }

  async createBucket(name: string) {
    const { data, error } = await this.storage.createBucket(name);
    if (error) {
      throw error;
    }
    return data;
  }

  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        'No se ha subido ningun archivo',
        HttpStatus.BAD_REQUEST,
      );
    }
    const fileName = Math.random().toString(36).substring(2) + Date.now();
    const extension = file.originalname.split('.').pop();
    this.logger.log('Subiendo archivo a supabase');
    const { data, error } = await this.storage
      .from(this.bucket)
      .upload(`docs/${fileName}.${extension}`, file.buffer);
    if (error) {
      this.logger.error(error);
      throw new HttpException(
        `Error SupaBase: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return data;
  }

  async removeFile(name: FileNameDto) {
    const { data, error } = await this.storage
      .from(this.bucket)
      .remove([name.name]);
    if (error) {
      this.logger.error(error);
      throw new HttpException(
        `Error SupaBase: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.log(data);
    return new HttpException(
      'El archivo se eliminó correctamente',
      HttpStatus.OK,
    );
  }

  async downloadFile(name: FileNameDto, res: Response) {
    const { data, error } = await this.storage
      .from(this.bucket)
      .download(name.name);

    if (error) {
      this.logger.error(error);
      throw new HttpException(
        `Error SupaBase: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data instanceof Blob) {
      const arrayBuffer = await data.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.contentType('application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${name.name}`);
      res.send(buffer);
    }
  }
}
