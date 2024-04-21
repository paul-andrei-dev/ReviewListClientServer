import { Box, Button, Stack, useMediaQuery } from '@mui/material';
import {
  addLast3Reviews,
  addTop3Review,
} from '../redux/slices/review-slice.ts';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store.ts';
import { reviewApi } from '../redux/apis/reviews/review.api.ts';
import { HISTORY_CARD_BG_COLOR } from '../constants.ts';
import { useTheme } from '@mui/material/styles';
import { ReviewCard } from '../components/review-card.tsx';
import { ColumnTitle } from '../components/column-title.tsx';

export const LandingPage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const [getTop3Reviews] = reviewApi.endpoints.getTop3.useLazyQuery();
  const dispatch = useDispatch();
  const allReviews = useSelector((state: RootState) => state.review.reviews);
  const isLoading = useSelector((state: RootState) => state.review.isLoading);
  const top3Reviews = useSelector(
    (state: RootState) => state.review.top3Reviews,
  );

  const getReviews = useCallback(() => {
    getTop3Reviews(Date.now())
      .unwrap()
      .then((response) => {
        const reviews = response.top3Reviews;
        dispatch(addLast3Reviews({ top3Reviews: reviews }));
        dispatch(addTop3Review({ top3Reviews: reviews }));
      });
  }, [dispatch, getTop3Reviews]);

  useEffect(() => {
    getReviews();

    const interval = setInterval(() => {
      getReviews();
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch, getReviews, getTop3Reviews]);

  useEffect(() => {
    sessionStorage.setItem('reviews', JSON.stringify(allReviews));
  }, [allReviews]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMediumScreen ? 'column-reverse' : 'row',
        justifyContent: 'space-between',
        alignItems: 'start',
        width: '100%',
      }}
    >
      <Button onClick={() => getReviews()} disabled={isLoading}>
        Refresh
      </Button>

      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <ColumnTitle title="Top 3 Reviews" />
        <Stack spacing={2}>
          {top3Reviews.map((review, index) => (
            <ReviewCard
              key={index}
              name={review.name}
              rating={review.rating}
              date={review.date}
              timezone={review.timezone}
              description={review.body}
            />
          ))}
        </Stack>
      </Box>

      {!isSmallScreen && (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <ColumnTitle title="History" />
          <Stack spacing={2}>
            {allReviews.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                rating={review.rating}
                date={review.date}
                timezone={review.timezone}
                description={review.body}
                sxStyles={{
                  backgroundColor: HISTORY_CARD_BG_COLOR[review.rating],
                }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};
