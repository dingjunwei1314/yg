import API from '@/api/select'


const permission = {
  state: {
    energy: {},
    allCity:[],
    city: [],
    alluser: [],
    workordertype: [],
    groundCompanyList: [],
    staffUserList:[],
    driverLevel:{}
  },
  mutations: {
    SET_ENERGY: (state, energy) => {
      state.energy = energy;
    },
    SET_ALL_CITY_LIST: (state, city) => {
      state.allCity = city;
    },
    SET_CITY_LIST: (state, city) => {
      state.city = city;
    },
    SET_ALL_USER: (state, user) => {
      state.alluser = user;
    },
    SET_WORK_ORDER_TYPE: (state, type) => {
      state.workordertype = type;
    },
    SET_GROUND_COMPANY_LIST: (state, data) => {
      state.groundCompanyList = data;
    },
    SET_STAFF_USER_LIST:(state, data)=>{
      state.staffUserList = data;
    },
    SET_DRIVER_LEVEL:(state, data) => {
      state.driverLevel = data;
    }
  },
  actions: {
    GetEnery: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        if (Object.keys(state.energy).length === 0) {
          API.getEnery().then(({data}) => {
            commit('SET_ENERGY', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } else {
          resolve(state.energy)
        }
      })
    },
    GetAllCity: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        if (state.city==undefined || state.city.length === 0) {
          API.getAllCityList().then(({data}) => {
            commit('SET_ALL_CITY_LIST', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } else {
          resolve(state.city)
        }
      })
    },
    GetCity: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        let  role_id;
        if (state.city==undefined || state.city.length === 0) {
          let u = localStorage._MyDaDao_user_data;
          if(u){
            role_id = JSON.parse(u).role_id;
          }else{
            reject('role_id不存在');
          }
          API.getCityList(role_id).then(({data}) => {
            commit('SET_CITY_LIST', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } else {
          resolve(state.city)
        }
      })
    },
    GetAllUser: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        // console.log(state)
        if ( state.alluser === undefined) {
          API.getAllAccount().then(({data}) => {
            // console.log(data)
            commit('SET_ALL_USER', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } else {
          if(state.alluser.length===0){
            API.getAllAccount().then(({data}) => {
              // console.log(data)
              commit('SET_ALL_USER', data)
              resolve(data)
            }).catch(error => {
              reject(error)
            })
          }else{
            resolve(state.alluser)
          }
        }
      })
    },
    GetWorkOrderType: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        if (state.workordertype.length === 0) {
          API.getAllWorkOrderType().then(({data}) => {
            commit('SET_WORK_ORDER_TYPE', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } else {
          resolve(state.workordertype)
        }
      })
    },
    GetGroundCompanyList: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        // if (state.groundCompanyList == undefined || state.groundCompanyList.length === 0) {
          const req = {}
          API.getGroundCompanyList(req).then(({data}) => {
          
            commit('SET_GROUND_COMPANY_LIST', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        // } else {
        //   resolve(state.groundCompanyList)
        // }
      })
    },
    GetStaffUserList: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        // if (state.staffUserList.length === 0) {
          const req = {
            page: 1,
            pageSize: 10,
          }
          API.getStaffList(req).then(({data}) => {
            commit('SET_STAFF_USER_LIST', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        // } else {
        //   resolve(state.staffUserList)
        // }
      })
    },
    GetDriverLevel: ({state, commit}) => {
      return new Promise((resolve, reject) => {
        if (state.driverLevel == undefined || Object.keys(state.driverLevel).length === 0) {
          const req = {}
          API.getDriverLevel(req).then(({data}) => {
            commit('SET_DRIVER_LEVEL', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        } else {
          resolve(state.driverLevel)
        }
      })
    },

  }
}

export default permission
