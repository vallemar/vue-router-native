import { createApp } from 'nativescript-vue';
import Home from './components/Home.vue';

import { router } from './router';

const app = createApp(Home);
app.use(router);
//router.push("/");
app.start();
setTimeout(() => {}, 500);
