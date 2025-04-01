import {
  NavigationFailure,
  createRouter as originalCreateRouter,
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
  RouteLocationRaw,
  Router,
  RouterOptions,
} from 'vue-router';
import { setAppContext, setRouter } from './app-context';
import { App } from 'nativescript-vue';
import { NativeRouterViewImpl } from './NativeRouterView';
export * from 'vue-router';
export { createNativeScriptHistory } from './native-history';

export const createRouter = (options: RouterOptions): Router => {
  const router = originalCreateRouter(options);
  const install = router.install;
  setRouter(router);

  //@ts-ignore
  options.history.setRouter(router);
  router.install = (app: App) => {
    setAppContext(app._context);
    app.component('NativeRouterView', NativeRouterViewImpl);
    install.call(router, app);
    //  router.push({ path: '/', state: { vueRouterInternalPush: true } });
  };
  return router;
};
