import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { store } from './redux/store.ts';
import { Provider } from 'react-redux';
import { AppRoutes } from './app-routes/app-routes.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <AppRoutes />
    </BrowserRouter>
  </Provider>,
);
