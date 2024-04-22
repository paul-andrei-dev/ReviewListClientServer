import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { CacheService } from '../shared/cache.service';
import { DataSetService } from './data-set/data-set.service';
import { DataSetParserService } from './data-set/data-set-parser.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { INDEX_CONSTANTS } from '../constants';
import { ITop3Reviews } from '../@types';
import { Response } from 'express';

describe('ReviewsController Integration Tests', () => {
  let controller: ReviewsController;
  let cacheService: CacheService<any>;
  let dataSetService: DataSetService;
  let dataSetParserService: DataSetParserService;
  const mockedValue: ITop3Reviews = {
    top3Reviews: [
      {
        name: 'John Doe',
        body: 'This is an insightful review highlighting the strengths of the product.',
        date: 1633036800000, // example timestamp
        timezone: 'UTC',
        rating: 5,
      },
      {
        name: 'Jane Smith',
        body: 'An average review pointing out both pros and cons.',
        date: 1633123200000, // example timestamp
        timezone: 'PST',
        rating: 3,
      },
      {
        name: 'Alice Johnson',
        body: 'A critical review detailing the areas of improvement.',
        date: 1633209600000, // example timestamp
        timezone: 'EST',
        rating: 2,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: CacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            invalidate: jest.fn(),
          },
        },
        {
          provide: DataSetService,
          useValue: {
            top3: jest
              .fn()
              .mockResolvedValue([
                { review: 'Review1' },
                { review: 'Review2' },
                { review: 'Review3' },
              ]),
          },
        },
        {
          provide: DataSetParserService,
          useValue: {
            getAverageRating: jest.fn().mockReturnValue(4.5), // Mock any methods that might be used
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    cacheService = module.get<CacheService<any>>(CacheService);
    dataSetService = module.get<DataSetService>(DataSetService);
    dataSetParserService =
      module.get<DataSetParserService>(DataSetParserService);
  });

  function createMockResponse(): Response {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      // @ts-ignore
      req: {
        headers: {},
      },
    };
  }

  it('should throw BadRequestException for invalid timestamps', async () => {
    const response = createMockResponse();
    await expect(controller.fetchTask('invalid', response)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should handle no-cache scenario correctly', async () => {
    const timestamp = '1609459200';
    const response = createMockResponse();
    response.req.headers['no-cache'] = 'true';

    jest.spyOn(dataSetService, 'top3').mockReturnValue(mockedValue);

    await controller.fetchTask(timestamp, response);
    expect(cacheService.invalidate).toHaveBeenCalledWith(timestamp);
    expect(dataSetService.top3).toHaveBeenCalledWith(Number(timestamp));
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(mockedValue);
  });

  it('should return cached data if available', async () => {
    const timestamp = '1609459200';
    const cachedData = [{ review: 'Cached Review' }];
    const response = createMockResponse();

    jest.spyOn(cacheService, 'get').mockReturnValue(cachedData);
    await controller.fetchTask(timestamp, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(cachedData);
    expect(dataSetService.top3).not.toHaveBeenCalled();
  });

  it('should fetch, cache, and return new data if not cached', async () => {
    const timestamp = '1609459200';
    const response = createMockResponse();

    jest.spyOn(cacheService, 'get').mockReturnValue(null);
    jest.spyOn(dataSetService, 'top3').mockReturnValue(mockedValue);
    jest.spyOn(cacheService, 'set').mockImplementation(() => {});

    await controller.fetchTask(timestamp, response);

    expect(dataSetService.top3).toHaveBeenCalledWith(Number(timestamp));
    expect(cacheService.set).toHaveBeenCalledWith(
      timestamp,
      mockedValue,
      INDEX_CONSTANTS.ttl_value,
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(mockedValue);
  });

  it('should handle errors during data fetching', async () => {
    const timestamp = '1609459200';
    const response = createMockResponse();

    jest.spyOn(dataSetService, 'top3').mockImplementation(() => {
      throw new Error('Data fetch failed');
    });

    await expect(controller.fetchTask(timestamp, response)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
