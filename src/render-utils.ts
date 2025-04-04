import { Application, Frame, Page } from '@nativescript/core';
import {
  createApp,
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  NSVElement,
  NSVRoot,
  provide,
  render,
  unref,
} from 'nativescript-vue';
import {
  RouteLocationNormalizedLoaded,
  RouteLocationResolved,
  Router,
} from 'vue-router';
import { getAppContext, getContextComponent } from './app-context';

export function renderRoutePage(route: RouteLocationResolved, props: any = {}) {
  /*  console.log('frameIdframeIdframeIdframeIdframeId', Application['frameId']);
  const frame = Frame.getFrameById('frame_1'); //resolveFrame(undefined);
  if (!frame) {
    console.log("'Frame not found'");

    throw new Error('Failed to resolve frame. Make sure your frame exists.');
  }

  const componentRouter =
    route.matched[route.matched.length - 1]?.components?.default;
  if (!componentRouter) return;
  const node = renderNode(componentRouter, props, {
    onHMR() {
       node.unmount();
      node.mount();
      nextTick(() => {
        frame.replacePage({
          ...{},
          transition: {
            name: 'fade',
            duration: 10,
          },
          create: () => node?.nativeView,
        });
      }); 
    },
  });
  node.mount();

  console.log('LLAMANDO A LA PAGINA', node.nativeView);

  nextTick(() => {
    frame.navigate({
      ...{},
      transition: {
        name: 'fade',
        duration: 10,
      },
      create: () => node?.nativeView,
    });
  }); */
}

export function renderRoutePage2(
  frame: Frame,
  componentRouter: any,
  props: any = {},
) {
  if (!frame) {
    console.log("'Frame not found'");

    throw new Error('Failed to resolve frame. Make sure your frame exists.');
  }

  if (!componentRouter) return;
  const node = renderNode(componentRouter, props, {
    onHMR() {
      /*   node.unmount();
      node.mount();
      nextTick(() => {
        frame.replacePage({
          ...{},
          transition: {
            name: 'fade',
            duration: 10,
          },
          create: () => node?.nativeView,
        });
      }); */
    },
  });
  node.mount();

  console.log('renderRoute', node.nativeView);

  nextTick(() => {
    frame.navigate({
      ...{},
      transition: {
        name: 'fade',
        duration: 10,
      },
      create: () => node?.nativeView,
    });
  });
}

export function renderNode(
  componentRouter: any,
  props: any,
  hooks: { onHMR: () => void },
) {
  let root: NSVRoot | null;
  const component = defineComponent({
    name: `Routed${componentRouter.__name}Component`,
    setup() {
      let mounted = false;
      return () => {
        const targetComponent = h(componentRouter, props);
        targetComponent.appContext = getAppContext();
        if (mounted && hooks?.onHMR) {
          hooks?.onHMR();
        }
        mounted = true;
        return targetComponent;
      };
    },
  });
  function mount() {
    try {
      let vNode = h(component);
      vNode.appContext = getAppContext(); //defaultRootPublic._vnode.el.__vnode.ctx; //getAppContext(); //getCurrentInstance()?.appContext;
      root = new NSVRoot();
      render(vNode, root);
    } catch (error) {
      console.error('Error mounting component:', error);
    }
  }

  function unmount() {
    if (root) {
      render(null, root);
    }
  }

  return {
    mount,
    unmount,
    get rootParent() {
      return root;
    },
    get vnode() {
      return root?.el;
    },
    get nativeView() {
      return root?.el?.nativeView;
    },
  };
}

function resolveFrame(frame?: Frame) {
  if (!frame) {
    return Frame.topmost();
  }
  const ob = unref(frame);
  if (ob instanceof Frame) {
    return ob;
  }
  //@ts-ignore
  if (ob instanceof NSVElement) {
    //@ts-ignore
    return ob.nativeView;
  }
  // todo: either change core Frame to add frames to the stack when they are created
  // or do as we did in 2.x - handle a Map of frames.
  // right now, empty frames can't be navigated as they are not recognized by `getFrameById`
  return Frame.getFrameById(ob);
}
