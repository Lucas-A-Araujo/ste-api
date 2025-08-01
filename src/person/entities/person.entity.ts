import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Person {
  @ApiProperty({ description: 'ID único da pessoa', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nome completo da pessoa', example: 'João Silva' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Gênero da pessoa', example: 'Masculino', required: false })
  @Column({ nullable: true })
  gender?: string;

  @ApiProperty({ description: 'Email da pessoa', example: 'joao.silva@email.com', required: false })
  @Column({ nullable: true, unique: true })
  email?: string;

  @ApiProperty({ description: 'Data de nascimento', example: '1990-01-15' })
  @Column()
  birthDate: Date;

  @ApiProperty({ description: 'Naturalidade da pessoa', example: 'São Paulo', required: false })
  @Column({ nullable: true })
  naturalness?: string;

  @ApiProperty({ description: 'Nacionalidade da pessoa', example: 'Brasileira', required: false })
  @Column({ nullable: true })
  nationality?: string;

  @ApiProperty({ description: 'CPF da pessoa (único)', example: '123.456.789-00' })
  @Column({ unique: true })
  cpf: string;

  @ApiProperty({ description: 'Endereço da pessoa', example: 'Rua das Flores, 123', required: false })
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  @UpdateDateColumn()
  updatedAt: Date;
}
