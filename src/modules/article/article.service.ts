import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThanOrEqual, IsNull } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Article } from 'src/database/entities/article.entity';
import { User } from 'src/database/entities/user.entity';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ConfigService } from '@nestjs/config';
import {
  IArticleResponse,
  IResponse,
} from 'src/common/interfaces/response.interface';
import {
  ArticleResponseWrapperDto,
  PaginatedArticlesWrapperDto,
} from './dto/response.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  private mapArticleToResponse(article: Article): IArticleResponse {
    return {
      id: article.id,
      title: article.title,
      description: article.description,
      publicationDate: article.publicationDate,
      author: {
        id: article.author.id,
        name: article.author.name,
      },
    };
  }

  async create(
    createArticleDto: CreateArticleDto,
    author: User,
  ): Promise<ArticleResponseWrapperDto> {
    const article = this.articlesRepository.create({
      ...createArticleDto,
      author,
    });

    await this.cacheManager.clear();

    const savedArticle = await this.articlesRepository.save(article);

    return {
      success: true,
      message: 'Article created successfully',
      data: this.mapArticleToResponse(savedArticle),
    };
  }

  async findAll(
    filterDto: ArticleFilterDto,
  ): Promise<PaginatedArticlesWrapperDto> {
    const cacheKey = `articles_${JSON.stringify(filterDto)}`;
    const cached =
      await this.cacheManager.get<PaginatedArticlesWrapperDto>(cacheKey);

    if (cached) return cached;

    const { publicationDate, authorId, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const query = this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.deletedAt IS NULL')
      .skip(skip)
      .take(limit);

    if (publicationDate) {
      const date = new Date(publicationDate);
      const nextDay = new Date(date);

      nextDay.setDate(date.getDate() + 1);

      query
        .andWhere({
          publicationDate: MoreThanOrEqual(date),
        })
        .andWhere({
          publicationDate: LessThanOrEqual(nextDay),
        });
    }

    if (authorId) {
      query.andWhere('author.id = :authorId', { authorId });
    }

    const [items, totalItems] = await query.getManyAndCount();
    const itemCount = items.length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = {
      success: true,
      message: 'Articles retrieved successfully',
      data: {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        items: items.map(this.mapArticleToResponse),
        meta: {
          totalItems,
          itemCount,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
        },
      },
    };

    await this.cacheManager.set(
      cacheKey,
      result,
      this.configService.get('redis.ttl'),
    );

    return result;
  }

  async findOne(id: number): Promise<ArticleResponseWrapperDto> {
    const cacheKey = `article_${id}`;
    const cached =
      await this.cacheManager.get<ArticleResponseWrapperDto>(cacheKey);

    if (cached) return cached;

    const article = await this.articlesRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    const result = {
      success: true,
      message: 'Article retrieved successfully',
      data: this.mapArticleToResponse(article),
    };

    await this.cacheManager.set(
      cacheKey,
      result,
      this.configService.get('redis.ttl'),
    );

    return result;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    user: User,
  ): Promise<ArticleResponseWrapperDto> {
    const article = await this.articlesRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    if (article.author.id != user.id) {
      throw new BadRequestException("You don't have a permission to update it");
    }

    Object.assign(article, updateArticleDto);

    await this.cacheManager.clear();
    const updatedArticle = await this.articlesRepository.save(article);

    return {
      success: true,
      message: 'Article updated successfully',
      data: this.mapArticleToResponse({ ...updatedArticle, author: user }),
    };
  }

  async remove(id: number, user: User): Promise<IResponse<null>> {
    const article = await this.articlesRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    if (article.author.id != user.id) {
      throw new BadRequestException("You don't have a permission to delete it");
    }

    await this.articlesRepository.softDelete(id);
    await this.cacheManager.clear();

    return {
      success: true,
      message: 'Article deleted successfully',
      data: null,
    };
  }
}
