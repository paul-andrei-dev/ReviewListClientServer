import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { isValidTimestamp } from '../utilities';
import { DataSetService } from './data-set/data-set.service';
import { CacheService } from '../shared/cache.service';
import { INDEX_CONSTANTS } from '../constants';
import { ITop3Reviews } from '../@types';
import { DataSetParserService } from './data-set/data-set-parser.service';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly dataSetService: DataSetService,
    private readonly cacheService: CacheService<ITop3Reviews>,
    private readonly dataSetParserService: DataSetParserService,
  ) {}

  @Get('average-rating')
  async getAverageRating(@Res() res: Response) {
    try {
      const averageRating = this.dataSetParserService.getAverageRating();
      return res.status(200).json({ average: averageRating });
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Get(':timestamp')
  async fetchTask(@Param('timestamp') timestamp: string, @Res() res: Response) {
    if (!timestamp || !isValidTimestamp(+timestamp)) {
      throw new BadRequestException('Invalid timestamp');
    }

    try {
      if (res.req.headers['no-cache']) {
        this.cacheService.invalidate(timestamp);
        const top3Result = this.dataSetService.top3(+timestamp);
        return res.status(200).json(top3Result);
      }

      const cachedResult = this.cacheService.get(timestamp);
      if (cachedResult) {
        return res.status(200).json(cachedResult);
      } else {
        const top3Result = this.dataSetService.top3(+timestamp);
        this.cacheService.set(timestamp, top3Result, INDEX_CONSTANTS.ttl_value);
        return res.status(200).json(top3Result);
      }
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
