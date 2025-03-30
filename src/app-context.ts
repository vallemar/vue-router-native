import { AppContext } from 'nativescript-vue';
import { Router } from 'vue-router';

let _ctx: AppContext | null = null;
let _ctxCompoent: any = null;
let _router: Router | null = null;
export function setAppContext(ctx: AppContext) {
  _ctx = ctx;
}

export function setRouter(router: Router) {
  _router = router;
}

export function getAppContext(): AppContext {
  if (!_ctx) throw new Error('AppContext has not been initialized');
  return _ctx;
}

export function getRouter() {
  return _router;
}

export function setContextComponent(ctx: any) {
  _ctxCompoent = ctx;
}

export function getContextComponent(): AppContext {
  if (!_ctxCompoent) throw new Error('AppContext has not been initialized');
  return _ctxCompoent;
}
