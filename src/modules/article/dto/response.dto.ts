import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dto/response.dto';
import {
  IArticleResponse,
  IPaginatedArticleResponse,
} from 'src/common/interfaces/response.interface';

export class ArticleAuthorDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class ArticleResponseDto implements IArticleResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: String, format: 'date-time' })
  publicationDate: Date;

  @ApiProperty({ type: ArticleAuthorDto })
  author: ArticleAuthorDto;
}

export class PaginationMetaDto {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

export class PaginatedArticleResponseDto implements IPaginatedArticleResponse {
  @ApiProperty({ type: [ArticleResponseDto] })
  items: ArticleResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class ArticleResponseWrapperDto extends BaseResponseDto {
  @ApiProperty({ type: ArticleResponseDto })
  data: ArticleResponseDto;
}

export class PaginatedArticlesWrapperDto extends BaseResponseDto {
  @ApiProperty({ type: PaginatedArticleResponseDto })
  data: PaginatedArticleResponseDto;
}
