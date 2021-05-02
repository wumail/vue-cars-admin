import { createStore } from "vuex";
import app from './modules/app';
import common from './modules/common';
import config from './modules/config';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    config,
    common,
  },
});
