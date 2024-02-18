import { api } from '../index.ts';
import { IReview } from '../../../index';
import { REVIEW_CONSTS } from './review.const';
import { HTTP_METHODS } from '../../const.ts';

export const reviewApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTop3: build.query<IReview[], number>({
      query: (payload) => ({
        url: REVIEW_CONSTS.endpoints.task.expand({ timestamp: payload }),
        method: HTTP_METHODS.GET,
      }),
    }),
  }),
});
