import { createApp } from 'nativescript-vue';
import App from './components/App.vue';

import { router } from './router';

const app = createApp(App);
app.use(router);
//router.push("/");
app.start();
setTimeout(() => {}, 500);
