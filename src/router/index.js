import { createRouter, createWebHistory } from "vue-router";
import Layout from '@/views/layout/index.vue';

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
      title: '控制台',
      icon: 'console',
      icon_class: 'icon_console',
    },
    hidden: false,
    redirect: 'index',
    component: Layout,
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
  {
    path: '/parking',
    name: 'Parking',
    meta: {
      title: '停车场',
      icon: 'console',
      icon_class: 'icon_console',
    },
    hidden: false,
    component: Layout,
    children: [
      {
        path: '/parkingIndex',
        name: 'ParkingIndex',
        meta: {
          name: '列表管理',
        },
        component: () => import('@/views/parking/index.vue'),
      },
      {
        path: '/parkingAdd',
        name: 'ParkingAdd',
        meta: {
          name: '新增停车场',
        },
        component: () => import('@/views/parking/add.vue'),
      },
    ]
  },
  {
    path: '/brand',
    name: 'Brand',
    meta: {
      title: '车辆品牌',
      icon: 'console',
      icon_class: 'icon_console',
    },
    hidden: false,
    component: Layout,
    children: [
      {
        path: '/brandList',
        name: 'BrandList',
        meta: {
          name: '品牌列表',
        },
        component: () => import('@/views/brand/index.vue'),
      },
      
    ]
  },
  {
    path: '/cars',
    name: 'Cars',
    meta: {
      title: '车辆管理',
      icon: 'console',
      icon_class: 'icon_console',
    },
    hidden: false,
    component: Layout,
    children: [
      {
        path: '/carsList',
        name: 'CarsList',
        meta: {
          name: '车辆列表',
        },
        component: () => import('@/views/cars/index.vue'),
      },
      {
        path: '/carsAdd',
        name: 'CarsAdd',
        meta: {
          name: '新增车辆',
        },
        component: () => import('@/views/cars/add.vue'),
      },
      
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
