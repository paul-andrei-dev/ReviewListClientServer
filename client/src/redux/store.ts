import { configureStore } from '@reduxjs/toolkit';
import reviewReducer from './slices/review-slice';
import { api } from './apis';
import { reviewApi } from './apis/reviews/review.api.ts';
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    review: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reviewApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
