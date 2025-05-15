import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'My first article',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The description of the article',
    example: 'This is my first article',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
