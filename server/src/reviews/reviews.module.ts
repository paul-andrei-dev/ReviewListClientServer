import { Module } from '@nestjs/common';
import { DataSetService } from './data-set/data-set.service';
import { DataSetParserService } from './data-set/data-set-parser.service';
import { ReviewsController } from './reviews.controller';
import { INDEX_CONSTANTS } from '../constants';
import { CacheService } from '../shared/cache.service';

@Module({
  providers: [
    DataSetService,
    CacheService,
    DataSetParserService,
    {
      provide: INDEX_CONSTANTS.ttl_label,
      useValue: INDEX_CONSTANTS.ttl_value,
    },
  ],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
