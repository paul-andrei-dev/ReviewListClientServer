import { Injectable, Inject } from '@nestjs/common';
import { DataSetService } from './data-set.service';
import { INDEX_CONSTANTS } from '../../constants'; // Adjust the import path as necessary

@Injectable()
export class DataSetParserService {
  private ratings: number[] = [];
  private datasetParserMaxLength = 600;
  private readonly ttl: number;

  constructor(
    private readonly dataSetService: DataSetService,
    @Inject(INDEX_CONSTANTS.ttl_label) ttl: number,
  ) {
    this.ttl = ttl;
    this.initDataFetch();
  }

  private initDataFetch(): void {
    this.fetchData();
    setInterval(() => this.fetchData(), this.ttl);
  }

  private fetchData(): void {
    const now = Date.now();
    const pastHour = new Date(now - 3600000).getTime();
    const newReviews = this.dataSetService.top3(pastHour).top3Reviews;
    newReviews.forEach((review) => {
      this.ratings.push(review.rating);
    });

    if (this.ratings.length > this.datasetParserMaxLength) {
      this.ratings = this.ratings.slice(-this.datasetParserMaxLength);
    }
  }

  getAverageRating(): number {
    if (this.ratings.length === 0) return 0;

    const sum = this.ratings.reduce((acc, rating) => acc + rating, 0);
    const average = sum / this.ratings.length;
    const averageRounded = Math.ceil(average * 100) / 100;
    return averageRounded;
  }
}
