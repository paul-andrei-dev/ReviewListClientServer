import { Box, Typography, Paper, Rating } from '@mui/material';

import { EMPTY_STATE } from '../constants.ts';
import { CSSProperties, FC } from 'react';

interface IReviewCardProps {
  name: string;
  description?: string;
  date?: number;
  timezone?: string;
  rating?: number;
  sxStyles?: CSSProperties;
}

export const ReviewCard: FC<IReviewCardProps> = ({
  name,
  description,
  date,
  timezone,
  rating,
  sxStyles,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, ...sxStyles }}>
      <Typography variant="h6" component="div" gutterBottom>
        {name || EMPTY_STATE}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {description || EMPTY_STATE}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Date: {date ? new Date(date).toLocaleString() : EMPTY_STATE}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Timezone: {timezone || EMPTY_STATE}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Rating name="read-only" value={rating} readOnly />
        <Typography ml={1}>({rating || EMPTY_STATE})</Typography>
      </Box>
    </Paper>
  );
};
