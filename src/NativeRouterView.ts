import { Application, Frame } from '@nativescript/core';
import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  InjectionKey,
  PropType,
  provide,
  ref,
  Ref,
  Slot,
  unref,
  VNodeProps,
  watch,
} from 'nativescript-vue';
import {
  RouteLocationMatched,
  RouteLocationNormalizedLoaded,
  Router,
  RouteRecord,
  useRoute,
  useRouter,
  routerViewLocationKey,
  viewDepthKey,
  matchedRouteKey,
} from 'vue-router';
import { renderRoutePage2 } from './render-utils';
const baseLog = 'NativeRouterView';

export const NativeRouterViewImpl = /*#__PURE__*/ defineComponent({
  name: 'NativeRouterView',
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String as PropType<string>,
      default: 'default',
    },
    initialPath: String,
    route: Object as PropType<RouteLocationNormalizedLoaded>,
  },

  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },

  setup(props, { attrs, slots }) {
    let isFirstRun = true;
    const router = useRouter();
    const route = useRoute();
    // const ctx = getCurrentInstance();

    const injectedRoute = inject<Ref<RouteLocationNormalizedLoaded>>(
      routerViewLocationKey,
    );

    const routeToDisplay = computed<RouteLocationNormalizedLoaded>(
      () => props.route || injectedRoute.value,
    );
    //  console.log(baseLog, 'ESTOOO', routeToDisplay.value);

    const injectedDepth = inject(viewDepthKey, 0);

    const depth = computed<number>(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute: RouteLocationMatched | undefined;
      while (
        (matchedRoute = matched[initialDepth]) &&
        !matchedRoute.components
      ) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed<RouteLocationMatched | undefined>(
      () => routeToDisplay.value.matched[depth.value],
    );

    provide(
      viewDepthKey,
      computed(() => depth.value + 1),
    );
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);

    const viewRef = ref<ComponentPublicInstance>();

    // watch at the same time the component instance, the route record we are
    // rendering, and the name

    watch(
      () => [viewRef.value, matchedRouteRef.value, props.name] as const,
      ([instance, to, name], [oldInstance, from, oldName]) => {
        /*   console.log(baseLog, 'INJECTED ROUTE', props.name, injectedRoute.value.fullPath);
        console.log(baseLog, 'WATCH', depth.value, props.name, {
          instance: instance === oldInstance,
          matchedRouteRef: to === from,
          name: name === oldName,
        }); */
        // copy reused instances
        if (to) {
          // this will update the instance for new instances as well as reused
          // instances when navigating to a new route
          to.instances[name] = instance;
          // the component instance is reused for a different route or name, so
          // we copy any saved update or leave guards. With async setup, the
          // mounting component will mount before the matchedRoute changes,
          // making instance === oldInstance, so we check if guards have been
          // added before. This works because we remove guards when
          // unmounting/deactivating components
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards;
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards;
            }
          }
        }

        // trigger beforeRouteEnter next callbacks
        if (
          instance &&
          to &&
          // if there is no instance but to and from are the same this might be
          // the first visit
          (!from || !isSameRouteRecord(to, from) || !oldInstance)
        ) {
          (to.enterCallbacks[name] || []).forEach((callback) =>
            callback(instance),
          );
        }
      },
      { flush: 'post' },
    );

    watch(route, (to) => {
      // componentToRender.value;
      //console.log(baseLog,'route.currentRoute');
      // console.log(baseLog,componentToRender.value);
    });
    const frameId = depth.value === 0 ? 'default' : `frame_${depth.value}`;
    const component = router.resolve(router.currentRoute.value.fullPath);
    const defaultRoute = getComponentsFromPath(router, props.initialPath)[0]
      ?.component;
    // console.log(baseLog,defaultRoute);
    let mounted = false;
    let rederized;

    let mountedFrame = false;
    // console.log(baseLog,'finish setup', props.name, depth.value);
    return () => {
      const currentName = props.name;
      const matchedRoute = matchedRouteRef.value;
      //  console.log(baseLog,'Start Render', props.name, matchedRouteRef.value?.path);

      const ViewComponent =
        matchedRoute && matchedRoute.components!['default' /* currentName */];
      console.log(baseLog, 'ViewComponent ', props.name, ViewComponent);

      if (mountedFrame && rederized) {
        console.log(baseLog, 'return renderized', props.name, frameId);
        return rederized;
      }
      if (ViewComponent && !mountedFrame && rederized) {
        mountedFrame = true;
      }
      if (ViewComponent && mounted && rederized) {
        //  Frame.getFrameById(frameId)?
        inject('frameId', frameId);
        console.log(baseLog, 'renderRoutePage2', props.name, frameId);

        renderRoutePage2(Frame.getFrameById(frameId), ViewComponent, {});
        //console.log(baseLog, 'INJECTED FRAME ID', frameId);

        //Application.['frameId'] = frameId;
        return rederized; // Aqui no quiero que haga nada
      }

      if (ViewComponent) {
        mounted = true;
      }
      console.log(baseLog, 'building renderized', props.name, frameId);
      rederized = h(
        'Frame',
        {
          id: frameId,
        },
        [
          h(ViewComponent, {
            ...attrs,
          }),
          /*  h(defaultRoute ?? component.matched[0].components.default, {
            ...attrs,
          }), */
        ],
      );
      return rederized;
    };
  },
});

const dummy = defineComponent({
  name: 'Dummy',
  props: {},
  setup() {
    return () => h('ContentView');
  },
});

function buildFrame() {
  return defineComponent({
    name: 'Frame',
    props: {},
    setup() {
      return () => h('Frame');
    },
  });
}
function getComponentFromRoute(routeRecords: RouteRecord[]) {
  return routeRecords ? routeRecords[0]?.components?.default : null;
}

function getComponentsFromPath(router: Router, path: string) {
  return router
    .getRoutes()
    .filter((r) => r.path !== '/' && r.path === path)
    .map((r) => ({ path, component: r.components?.default }));
}

function getRouteFromPath(router: Router, path: string) {
  return router.getRoutes().find((r) => r.path === path);
}
function normalizeSlot(slot: Slot | undefined, data: any) {
  if (!slot) return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
/**
 * Check if two `RouteRecords` are equal. Takes into account aliases: they are
 * considered equal to the `RouteRecord` they are aliasing.
 *
 * @param a - first {@link RouteRecord}
 * @param b - second {@link RouteRecord}
 */
function isSameRouteRecord(a: RouteRecord, b: RouteRecord): boolean {
  // since the original record has an undefined value for aliasOf
  // but all aliases point to the original record, this will always compare
  // the original record
  return (a.aliasOf || a) === (b.aliasOf || b);
}
