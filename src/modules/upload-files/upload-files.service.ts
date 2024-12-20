import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { StorageClient } from '@supabase/storage-js';
import { URL_SUPABASE, SERVICE_KEY } from 'src/core/config';
import { FileNameDto } from './dto/file.dto';
import { Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { v2 } from 'cloudinary';
@Injectable()
export class UploadFilesService {
  private readonly storage = new StorageClient(URL_SUPABASE, {
    Authorization: `Bearer ${SERVICE_KEY}`,
    apiKey: SERVICE_KEY,
  });
  private readonly bucket = 'product-img';

  private readonly logger = new Logger(UploadFilesService.name);

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

  async uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new HttpException(
        'No se ha subido ningun archivo',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.log('Subiendo archivo a cloudinary');
    try {
      const result = await this.uploadImage(file);

      console.log(result);

      if (!result) {
        throw new HttpException(
          'No se pudo subir la imagen',
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(error);
      const errorMessages = error.message || error.error;
      throw new HttpException(
        `Error Cloudinary: ${errorMessages}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadImages(files: Express.Multer.File[]) {
    try {
      const result = await Promise.all(
        files.map(async (file) => {
          return await this.uploadImage(file);
        }),
      );

      console.log(result);

      if (!result) {
        throw new HttpException(
          'No se pudo subir la imagen',
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        `Error Cloudinary: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const fileName = Math.random().toString(36).substring(2) + Date.now();
      const uploadOptions = {
        folder: 'ecommerce',
        filename_override: `${fileName}`,
        transformation: [
          { width: 600, height: 600, crop: 'scale' },
          { quality: 'auto', fetch_format: 'avif' },
          { radius: 20 },
          { gravity: 'auto' },
          { effect: 'sharpen' },
        ],
      };

      const upload = v2.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        },
      );
      upload.end(file.buffer);
    });
  }

  async removeImage(publicId: string[]) {
    try {
      const result = await Promise.all(
        publicId.map(async (id) => {
          return await v2.uploader.destroy(id, { invalidate: true });
        }),
      );
      console.log(result);
      if (!result) {
        throw new HttpException(
          'No se pudo eliminar la imagen',
          HttpStatus.BAD_REQUEST,
        );
      }
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        `Error Cloudinary: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
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
