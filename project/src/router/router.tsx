import Main from '../pages/main';
import { Route, Routes } from 'react-router-dom';
import Offer from '../pages/offer';
import Login from '../pages/login';
import { AppRoute } from './RoutePath';
import NotFound from '../pages/not-found';
import { useAppSelector } from '../hooks';
import { AuthorizationStatus } from '../constants/constants';
import LoadingScreen from '../components/loading-screen';
import HistoryRouter from '../components/history-router';
import browserHistory from '../browser-history/browser-history';
import Layout from '../components/layout';


const Router = () => {
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const isOfferDataLoading = useAppSelector((state) => state.isOffersDataLoading);

  if (authorizationStatus === AuthorizationStatus.Unknown || isOfferDataLoading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <HistoryRouter history={browserHistory}>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path={AppRoute.Root} element={<Main />} />
          <Route path={AppRoute.Offer} element={<Offer />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path={AppRoute.Login} element={<Login />} />
      </Routes>
    </HistoryRouter>
  );
};

export default Router;
