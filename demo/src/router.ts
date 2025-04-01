import { createRouter, createNativeScriptHistory } from 'vue-router-native';
import Home from '@/components/Home.vue';
import Details from '@/components/Details.vue';
import Depth2 from '@/components/Depth2.vue';

export const router = createRouter({
  history: createNativeScriptHistory(),
  routes: [
    {
      path: '/base',
      component: Home,
      children: [
        { path: '', redirect: '/base/details' },
        { path: 'details', component: Details },
        { path: 'depth2', component: Depth2 },
      ],
    },
    { path: '/depth2', component: Depth2 },
    ,
  ],
});

/* router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from);
  if (to.path === '/') {
    router.push({ path: '/details' });
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
  } else {
    next();
  }
  next();
}); */
