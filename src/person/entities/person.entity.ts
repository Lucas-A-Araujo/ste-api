import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column()
  birthDate: Date;

  @Column({ nullable: true })
  naturalness?: string;

  @Column({ nullable: true })
  nationality?: string;

  @Column({ unique: true })
  cpf: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
