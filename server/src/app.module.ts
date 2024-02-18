import {Module} from '@nestjs/common';
import {SharedModule} from './shared/shared.module';
import {ReviewsModule} from './reviews/reviews.module';

@Module({
  imports: [SharedModule, ReviewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
