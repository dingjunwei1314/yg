import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import main from '@/components/main'

const whiteRouterMap = [
  { path: '/login', component: () => import('@/components/login'), hidden: true },
  { path: '/noperm', component: () => import('@/components/sys/noperm'), hidden: true },
  { path: '*', component: () => import('@/components/sys/error'), hidden: true }
]

export const constantRouterMap = [
  {
    path: '/',
    component: main,
    redirect: '/index',
    name: 'main',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/components/index')
    },
    {
      path: '/usercenter',
      name: 'usercenter',
      component: () => import('@/components/index/usercenter'),
      meta: {perm: 'sys:user'}
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('@/components/sys/menu'),
      meta: {perm: 'sys:menu'}
    },
    {
      path: '/dept',
      name: 'dept',
      component: () => import('@/components/sys/dept'),
      meta: {perm: 'sys:dept'}
    },
    {
      path: '/log',
      name: 'log',
      component: () => import('@/components/sys/log'),
      meta: {perm: 'sys:log'}
    },
    {
      path: '/role',
      name: 'role',
      component: () => import('@/components/sys/role'),
      meta: {perm: 'sys:role'}
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/components/sys/user'),
      meta: {perm: 'sys:user'}
    }]
  },
  {
    path: '/peccancy',
    component: main,
    children:[
      {
        path: 'list',
        component: () => import('@/components/peccancy/list')
      }
    ]
  },
  {
    path: '/gservice',
    component: main,
    children: [
      {
        path: 'supplier',
        component: () => import('@/components/gservice/supplier')
      },
      {
        path:'list',
        component: () => import('@/components/gservice/list')
      },
      {
        path:'add',
        component: () => import('@/components/gservice/add')
      }
    ]
  },
  {
    path: '/workorder',
    component: main,
    children: [
      {
        path: 'list',
        component: () => import('@/components/workOrder/list')
      },
      {
        path: 'parklist',
        component: () => import('@/components/workOrder/parkList')
      },
      {
        path:'config',
        component:() => import('@/components/workOrder/timeConfig')
      },
      {
        path:'unfinished',
        component:() => import('@/components/workOrder/unfinishedOrderList')
      },
      {
        path:'nothandled',
        component:() => import('@/components/workOrder/nothandledOrderList')
      },
      
    ]
  },
  {
    path: '/city',
    component: main,
    children: [
      {
        path: 'list',
        component: () => import('@/components/city/list')
      },
      {
        path: 'setenclosure',
        component: () => import('@/components/city/setenclosure')
      },
      {
        path: 'addenclosure',
        component: () => import('@/components/city/addenclosure')
      },
    ]
  },

  {
    path: '/message',
    component: main,
    children: [
      {
        path: 'list',
        component: () => import('@/components/message/list')
      }
    ]
  }, 
  {
    path: '/dot',
    component: main,
    children: [
      {
        path: 'list',
        component: () => import('@/components/dot/dotList')
      },
      {
        path: 'add',
        component: () => import('@/components/dot/add')
      },  
      {
        path: 'carList',
        component: () => import('@/components/dot/carList')
      }, 
      {
        path: 'dispatchRecord',
        component: () => import('@/components/dot/dispatchRecord')
      }, 
      {
        path: 'addOrEdit',
        component: () => import('@/components/dot/addOrEdit')
      }
    ]
  },
  {
    path: '/gasSation',
    component: main,
    children: [
      {
        path: 'list',
        component: () => import('@/components/gasSation/list')
      },
      {
        path: 'addOrEdit',
        component: () => import('@/components/gasSation/addOrEdit')
      },
      {
        path: 'add',
        component: () => import('@/components/gasSation/add')
      }
    ]
  },
  {
    path: '/carwash',
    component: main,
    children: [
      {
        path: 'list',
        component: () => import('@/components/carwash/list')
      },
      {
        path: 'addOrEdit',
        component: () => import('@/components/carwash/addOrEdit')
      },
      {
        path: 'add',
        component: () => import('@/components/carwash/add')
      }
    ]
  }
]

const router = new Router({
  // hashbang: false,
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: whiteRouterMap.concat(constantRouterMap)
})


export default router
