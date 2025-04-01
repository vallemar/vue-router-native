// native-history.ts
import { renderRoutePage } from './render-utils';
import {
  type Router,
  type RouteLocationNormalizedLoaded,
  type HistoryState,
  RouterHistory,
  useRouter,
} from 'vue-router';
import { Application, Frame } from '@nativescript/core';

type NavigationCallback = (to: string, state: HistoryState | null) => void;
export const START = '';

export function createNativeScriptHistory(): RouterHistory & {
  setRouter: (router: Router) => void;
} {
  let currentLocation = START;
  let base = normalizeBase();
  const listeners = new Set<NavigationCallback>();
  const stack: string[] = [];
  let router: Router;
  function notify(to: string) {
    currentLocation = to;
    for (const cb of listeners) cb(to, null);
  }
  function setLocation(location: any, data: any) {
    const route = router.resolve(location);
    //  if (data?.vueRouterInternalPush !== true) renderRoutePage(route, data);
    notify(route.fullPath);
    return route;
  }

  return {
    setRouter(routerUpdate: Router) {
      router = routerUpdate;
      ensureRouterReady(router, base);
    },
    location: currentLocation,
    state: {},
    base: base,
    createHref: createHref.bind(null, base),
    push(to: string, data?: HistoryState) {
      console.log('NativeScriptHistory push', to);
      const route = setLocation(to, data);
      stack.push(route.fullPath);
    },

    replace(to: string, data?: HistoryState) {
      console.log('NativeScriptHistory replace', to, data);
      const route = setLocation(to, data);
      stack[stack.length - 1] = route.fullPath;
    },

    go(delta: number) {
      console.log('NativeScriptHistory go', delta);

      if (delta < 0 && Frame.topmost().canGoBack()) {
        Frame.topmost().goBack();
        stack.pop();
        const to = stack[stack.length - 1];
        notify(to);
      }
    },
    //@ts-ignore
    listen(cb: NavigationCallback) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },

    destroy() {
      listeners.clear();
    },
  };
}
function ensureRouterReady(router: Router, initialPatch = '/') {
  Application.on('launch', () => {
    router.push({ path: '/base', state: { vueRouterInternalPush: true } });
  });
}

const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base: string, location: any): string {
  return base.replace(BEFORE_HASH_RE, '#') + location;
}

function normalizeBase(base?: string): string {
  if (!base) {
    base = '/';
  }

  // ensure leading slash when it was removed by the regex above avoid leading
  // slash with hash because the file could be read from the disk like file://
  // and the leading slash would cause problems
  if (base[0] !== '/' && base[0] !== '#') base = '/' + base;

  // remove the trailing slash so all other method can just do `base + fullPath`
  // to build an href
  return removeTrailingSlash(base);
}

const TRAILING_SLASH_RE = /\/$/;
export const removeTrailingSlash = (path: string) =>
  path.replace(TRAILING_SLASH_RE, '');
