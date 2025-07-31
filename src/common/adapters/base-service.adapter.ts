import { Injectable } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { IVersionedService } from '../interfaces/versioned-service.interface';

@Injectable()
export abstract class BaseServiceAdapter<T extends ObjectLiteral, CreateDto, UpdateDto> implements IVersionedService<T, CreateDto, UpdateDto> {
  constructor(protected readonly repository: Repository<T>) {}

  abstract create(dto: CreateDto): Promise<T>;
  abstract findAll(): Promise<T[]>;
  abstract findOne(id: number): Promise<T>;
  abstract update(id: number, dto: UpdateDto): Promise<T>;
  abstract remove(id: number): Promise<void>;

  protected getRepository(): Repository<T> {
    return this.repository;
  }
} 