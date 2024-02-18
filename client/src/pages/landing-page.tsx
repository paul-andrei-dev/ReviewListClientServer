import {
  Box,
  Typography,
  Paper,
  Stack,
  Rating,
  Button,
  useMediaQuery,
} from '@mui/material';
import {
  addLast3Reviews,
  addTop3Review,
  setReviews,
} from '../redux/slices/review-slice.ts';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store.ts';
// import { reviews } from '../mock-data/data.ts';
import { reviewApi } from '../redux/apis/reviews/review.api.ts';
import { EMPTY_STATE } from '../constants.ts';
import { HISTORY_CARD_BG_COLOR } from '../redux/const.ts';
import { useTheme } from '@mui/material/styles';

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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

  // useEffect(() => {
  //   const storedReviews = sessionStorage.getItem('reviews');
  //
  //   const oldReviews = JSON.parse(storedReviews || JSON.stringify([]));
  //
  //   setTimeout(() => {
  //     dispatch(setReviews(oldReviews));
  //   }, 1000);
  // }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMediumScreen ? 'column-reverse' : 'row', // Adjust layout based on screen width
        justifyContent: 'space-between',
        alignItems: 'start',
        width: '100%',
      }}
    >
      <Button onClick={() => getReviews()} disabled={isLoading}>
        Refresh
      </Button>

      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Top 3 Reviews
        </Typography>
        <Stack spacing={2}>
          {top3Reviews.map((review, index) => (
            <Paper key={index} elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" component="div" gutterBottom>
                {review?.name || EMPTY_STATE}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {review?.body || EMPTY_STATE}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date:{' '}
                {review?.date
                  ? new Date(review?.date).toLocaleString()
                  : EMPTY_STATE}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Timezone: {review?.timezone || EMPTY_STATE}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating name="read-only" value={review?.rating} readOnly />
                <Typography ml={1}>
                  ({review?.rating || EMPTY_STATE})
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>

      {!isSmallScreen && (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            History
          </Typography>
          <Stack spacing={2}>
            {allReviews.map((review, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  p: 2,
                  backgroundColor: HISTORY_CARD_BG_COLOR[review.rating],
                }}
              >
                <Typography variant="h6" component="div" gutterBottom>
                  {review?.name || EMPTY_STATE}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {review?.body || EMPTY_STATE}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date:{' '}
                  {review?.date
                    ? new Date(review?.date).toLocaleString()
                    : EMPTY_STATE}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Timezone: {review?.timezone || EMPTY_STATE}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating name="read-only" value={review?.rating} readOnly />
                  <Typography ml={1}>
                    ({review?.rating || EMPTY_STATE})
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};
