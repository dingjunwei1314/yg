const index = () => import('../../components/index.vue')
const menu = () => import('../../components/sys/menu')
const dept = () => import('../../components/sys/dept')
const role = () => import('../../components/sys/role')
const user = () => import('../../components/sys/user')
const usercenter = () => import('../../components/index/usercenter.vue')

export default [
    {
        path: '/',
        redirect: '/index',
        meta: {perm: '*'}
    },
    {
        path: '/index',
        name: 'index',
        component: index,
        meta: {perm: '*'}
    },
    {
        path: '/menu',
        name: 'menu',
        component: menu,
        meta: {perm: 'sys:menu'}
    },
    {
        path: '/dept',
        name: 'dept',
        component: dept,
        meta: {perm: 'sys:dept'}
    },
    {
        path: '/role',
        name: 'role',
        component: role,
        meta: {perm: 'sys:role'}
    },
    {
        path: '/user',
        name: 'user',
        component: user,
        meta: {perm: 'sys:user'}
    },
    {
        path: '/usercenter',
        name: 'usercenter',
        component: usercenter,
        meta: {perm: 'sys:user'}
    }
]
