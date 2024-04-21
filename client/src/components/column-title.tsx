import { Typography } from '@mui/material';
import { FC } from 'react';

interface IColumnTitleProps {
  title: string;
}

export const ColumnTitle: FC<IColumnTitleProps> = ({ title }) => {
  return (
    <Typography variant="h4" gutterBottom textAlign="center">
      {title}
    </Typography>
  );
};
