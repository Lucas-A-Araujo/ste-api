export interface IVersionedService<T, CreateDto, UpdateDto> {
  create(dto: CreateDto): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(id: number): Promise<T>;
  update(id: number, dto: UpdateDto): Promise<T>;
  remove(id: number): Promise<void>;
} 