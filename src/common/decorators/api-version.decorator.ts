import { SetMetadata } from '@nestjs/common';

export const API_VERSION_KEY = 'apiVersion';
export const ApiVersion = (...versions: string[]) => SetMetadata(API_VERSION_KEY, versions); 