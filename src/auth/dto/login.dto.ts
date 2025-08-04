import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email do usuário',
    example: 'admin@example.com',
    type: String
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'admin123',
    type: String,
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
} 