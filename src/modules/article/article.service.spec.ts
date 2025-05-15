import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './article.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Article } from '../../database/entities/article.entity';
import { User } from '../../database/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockArticleRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
});

const mockCache = () => ({ get: jest.fn(), set: jest.fn(), clear: jest.fn() });
const mockConfigService = () => ({ get: jest.fn().mockReturnValue(60) });

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articleRepo: ReturnType<typeof mockArticleRepo>;
  let cache: ReturnType<typeof mockCache>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: getRepositoryToken(Article), useFactory: mockArticleRepo },
        { provide: CACHE_MANAGER, useFactory: mockCache },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get(ArticlesService);
    articleRepo = module.get(getRepositoryToken(Article));
    cache = module.get(CACHE_MANAGER);
  });

  it('should throw if article not found on delete', async () => {
    articleRepo.findOne.mockResolvedValue(null);
    await expect(service.remove(1, { id: 1 } as User)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw if user tries to delete another user article', async () => {
    articleRepo.findOne.mockResolvedValue({ author: { id: 2 } });
    await expect(service.remove(1, { id: 1 } as User)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should delete article and clear cache', async () => {
    articleRepo.findOne.mockResolvedValue({ author: { id: 1 }, id: 1 });
    articleRepo.softDelete.mockResolvedValue(undefined);

    const result = await service.remove(1, { id: 1 } as User);
    expect(result.success).toBe(true);
    expect(cache.clear).toHaveBeenCalled();
  });
});
