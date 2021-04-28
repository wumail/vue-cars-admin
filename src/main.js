import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import VueCompositionApi from '@vue/composition-api';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import './icons/index';
import svgIcon from './icons/svgIcon.vue';

const app = createApp(App);

app.use(store).use(router).use(ElementPlus).mount("#app");

app.component('svg-icon', svgIcon);