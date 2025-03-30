import {
  createRouter as originalCreateRouter,
  Router,
  RouterOptions,
} from 'vue-router';
import { setAppContext, setRouter } from './app-context';
export * from 'vue-router';
export { createNativeScriptHistory } from './native-history';

export const createRouter = (options: RouterOptions): Router => {
  const router = originalCreateRouter(options);
  const vueRouterInstall = router.install;
  setRouter(router);

  //@ts-ignore
  options.history.setRouter(router);
  router.install = (app) => {
    setAppContext(app._context);
    vueRouterInstall.call(router, app);
  };
  return router;
};
