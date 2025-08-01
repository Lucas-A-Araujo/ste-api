import { Body, Controller, Delete, Get, Param, Post, Put, Version } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { CreatePersonV2Dto } from './dto/create-person-v2.dto';
import { UpdatePersonV2Dto } from './dto/update-person-v2.dto';

@Controller('people')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Post()
  @Version('1')
  create(@Body() dto: CreatePersonDto) {
    return this.service.create(dto);
  }

  @Post()
  @Version('2')
  createV2(@Body() dto: CreatePersonV2Dto) {
    return this.service.create(dto);
  }

  @Get()
  @Version('1')
  findAll() {
    return this.service.findAll();
  }

  @Get()
  @Version('2')
  findAllV2() {
    return this.service.findAll();
  }

  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Get(':id')
  @Version('2')
  findOneV2(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @Version('1')
  update(@Param('id') id: string, @Body() dto: UpdatePersonDto) {
    return this.service.update(+id, dto);
  }

  @Put(':id')
  @Version('2')
  updateV2(@Param('id') id: string, @Body() dto: UpdatePersonV2Dto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Version('1')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Delete(':id')
  @Version('2')
  removeV2(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
