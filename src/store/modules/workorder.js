import API from '@/api/workorder'


const permission = {
  state: {
    workstatus: {},
    workordertype:[],
  },
  mutations: {
    SET_WORK_STATUS: (state, type) => {
      state.workstatus = type;
    },
    SET_WORK_ORDER_TYPE: (state, type) => {
      state.workordertype = type;
    },
  },
  actions: {
    GetWorkStatus: ({ state , commit }) => {
      return new Promise((resolve, reject) => {
        if(Object.keys(state.workstatus).length === 0){
          API.getWorkStatus().then(({data}) => {
            commit('SET_WORK_STATUS', data)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        }else {
          resolve(state.workstatus)
        }
      })
    }
  }
}

export default permission
