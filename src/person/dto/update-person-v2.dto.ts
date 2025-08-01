import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonV2Dto } from './create-person-v2.dto';

export class UpdatePersonV2Dto extends PartialType(CreatePersonV2Dto) {} 