import { createRouter, createNativeScriptHistory } from 'vue-router-native';
import Home from '@/components/Home.vue';
import Details from '@/components/Details.vue';

export const router = createRouter({
  history: createNativeScriptHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/details', component: Details },
  ],
});
