import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsDateString, IsNumber, Min } from 'class-validator';

export class ArticleFilterDto {
  @ApiProperty({
    description: 'Publication date of the article. Format: "YYYY-MM-DD"',
    example: '2025-05-20',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @ApiProperty({
    description: 'Author ID of the article',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => +value)
  @IsOptional()
  @IsNumber()
  authorId?: number;

  @ApiProperty({
    description: 'Page number. Default is 1.',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Limit of articles per page. Default is 10.',
    example: 10,
    required: false,
  })
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;
}
