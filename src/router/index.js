import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    redirect: 'login',
    meta: {
      name: '主页',
    },
    hidden: true,
  },
  // {
  //   path: '/test',
  //   name: 'Test',
  //   meta: {
  //     name: 'test',
  //   },
  //   hidden: true,
  //   component: () => import('@/views/Home.vue'),
  // },
  {
    path: '/login',
    name: 'Login',
    meta: {
      name: '登录',
    },
    hidden: true,
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/console',
    name: 'Console',
    meta: {
      name: '控制台',
    },
    hidden: false,
    redirect: 'index',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/index',
        name: 'Index',
        meta: {
          name: '首页',
        },
        component: () => import('@/views/console/index.vue'),
      },
      // {
      //   path: '/test',
      //   name: 'Test',
      //   meta: {
      //     name: 'test',
      //   },
      //   component: () => import('@/views/Home.vue'),
      // },
    ]
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
