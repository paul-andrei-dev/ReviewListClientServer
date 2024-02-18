export interface ITop3Reviews {
  top3Reviews: Array<IReview>;
}

export interface IReview {
  name: string;
  body: string;
  date: number;
  timezone: string;
  rating: number;
}
