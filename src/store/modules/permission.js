import { constantRouterMap } from '@/router'
import { getInfo } from '@/api/user'

function hasPermission (roles, route) {
  if (route.meta && route.meta.menuId) {
    return roles.includes(route.meta.menuId)
  } else {
    return true
  }
}

const permission = {
  state: {
    addRouters: [],
    roles: [],
    includes:[]
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = state.addRouters.concat(routers)
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INCLUDES: (state,includes) => {
      state.includes = includes;
    }
  },
  actions: {
    // 动态生成路由表
    GenerateRoutes: ({ commit }, menuCodes) => {
      return new Promise(resolve => {
        const accessedRouters = constantRouterMap.filter(v => {
          if (hasPermission(menuCodes, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(menuCodes, child)) {
                  return child
                }
                return false
              })
              return v
            } else {
              return v
            }
          }
          return false
        })
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    GetUserRoles: ({ commit }, userInfo) => {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          commit('SET_ROLES', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetIncludes: ({ commit }, includes) => {
      commit('SET_INCLUDES', includes)
    }
  }
}

export default permission
