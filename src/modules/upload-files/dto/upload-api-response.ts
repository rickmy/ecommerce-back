import { UploadApiResponse } from 'cloudinary';

export class UploadApiResponseCloudinary implements UploadApiResponse {
  [futureKey: string]: any;
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image' | 'auto' | 'video' | 'raw';
  created_at: string;
  tags: string[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  moderation: string[];
  access_control: string[];
  context: object;
  metadata: object;
  colors?: [string, number][];
}
