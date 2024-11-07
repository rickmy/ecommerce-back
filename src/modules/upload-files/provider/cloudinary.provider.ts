import { Provider } from '@nestjs/common';
import { v2 } from 'cloudinary';
import config from 'src/core/config';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: config().cloudinaryCloudName,
      api_key: config().cloudinaryApiKey,
      api_secret: config().cloudinaryApiSecret,
      secure: true,
    });
  },
};
