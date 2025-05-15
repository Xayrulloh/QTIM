import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'The email of the user',
    example: 'user@example.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    type: String,
    description: 'The password of the user',
    example: 'secret',
    minLength: 6,
  })
  password: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;
}
