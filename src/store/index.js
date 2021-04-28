import { createStore } from "vuex";
import app from './modules/app';
import common from './modules/common';

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app, 
    common,
  },
});
