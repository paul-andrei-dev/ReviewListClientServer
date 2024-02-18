import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { IReview } from '../../index';
import { reviewApi } from '../apis/reviews/review.api.ts';

interface ReviewPayload {
  top3Reviews: IReview[];
}

interface IInitialState {
  reviews: IReview[];
  isLoading: boolean;
  top3Reviews: IReview[];
}

const getOldReviews = () => {
  const storedReviews = sessionStorage.getItem('reviews');
  const oldReviews = JSON.parse(storedReviews || JSON.stringify([]));
  return oldReviews;
};

const initialState: IInitialState = {
  reviews: getOldReviews(),
  top3Reviews: [],
  isLoading: false,
};
export const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    addLast3Reviews: (state, action: PayloadAction<ReviewPayload>) => {
      // state.reviews = state.reviews.concat(action.payload.top3Reviews);
      state.reviews = [...action.payload.top3Reviews, ...state.reviews];
    },
    setReviews: (state, action: PayloadAction<IReview[]>) => {
      // state.reviews = state.reviews.concat(action.payload.top3Reviews);
      state.reviews = action.payload;
    },
    addTop3Review: (state, action: PayloadAction<ReviewPayload>) => {
      state.top3Reviews = action.payload.top3Reviews;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        reviewApi.endpoints.getTop3.matchFulfilled,
        reviewApi.endpoints.getTop3.matchRejected,
      ),
      (state) => {
        state.isLoading = false;
      },
    );
    builder.addMatcher(reviewApi.endpoints.getTop3.matchPending, (state) => {
      state.isLoading = true;
    });
  },
});

export const { addLast3Reviews, addTop3Review, setReviews } =
  reviewSlice.actions;

export default reviewSlice.reducer;
