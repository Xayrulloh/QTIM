import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBasicAuth,
} from '@nestjs/swagger';
import { ArticlesService } from './article.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ArticleResponseWrapperDto,
  PaginatedArticlesWrapperDto,
} from './dto/response.dto';
import { BaseResponseDto } from 'src/common/dto/response.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiBasicAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({
    status: 201,
    description: 'Article successfully created',
    type: ArticleResponseWrapperDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createArticleDto: CreateArticleDto,
    @GetUser() user: User,
  ): Promise<ArticleResponseWrapperDto> {
    return this.articlesService.create(createArticleDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Articles retrieved successfully',
    type: PaginatedArticlesWrapperDto,
  })
  findAll(
    @Query() filterDto: ArticleFilterDto,
  ): Promise<PaginatedArticlesWrapperDto> {
    return this.articlesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single article by ID' })
  @ApiResponse({
    status: 200,
    description: 'Article retrieved successfully',
    type: ArticleResponseWrapperDto,
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleResponseWrapperDto> {
    return this.articlesService.findOne(id);
  }

  @Put(':id')
  @ApiBasicAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an article' })
  @ApiResponse({
    status: 200,
    description: 'Article updated successfully',
    type: ArticleResponseWrapperDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @GetUser() user: User,
  ): Promise<ArticleResponseWrapperDto> {
    return this.articlesService.update(id, updateArticleDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an article' })
  @ApiResponse({
    status: 200,
    description: 'Article deleted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.articlesService.remove(id, user);
  }
}
