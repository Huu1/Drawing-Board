import Loadable from 'react-loadable';
import Loading from '@/components/RouteLoading';

const Error = Loadable({
  loader: () => import(/* webpackChunkName:'Dashboard' */ '@/page/notFound'),
  loading: Loading
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [{ path: '/error/404', component: Error, exact: false }];
