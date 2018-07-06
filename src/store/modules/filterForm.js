const filterForm = {
    state: {
        filterFormGasSation:{}
    },
    mutations: {
      CHANGE_FFG(state,data){
        state.filterFormGasSation = data
      }
    },
    actions:{
      changeFfG({ commit }, data){
        commit('CHANGE_FFG', data)
      }
    }
  }
  
  export default filterForm
  