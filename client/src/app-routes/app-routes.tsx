import { Route, Routes } from 'react-router-dom';
import { APP_ROUTES_CONSTS } from './app-routes.const.ts';
import { NotFound } from '../pages/not-found-page.tsx';
import { Box } from '@mui/material';
import { LandingPage } from '../pages/landing-page.tsx';

const { root } = APP_ROUTES_CONSTS;

export const AppRoutes = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Routes>
        <Route path={root} element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
};
