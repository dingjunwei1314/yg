const user = {
  state: {
    userName: '',
    loading:false,
    isShowAll:true,
    userInfo: {},
    message:true
  },
  mutations: {
    userName(state,data) {
      state.userName=data;
    },
    loading(state,data) {
      state.loading=data;
    },
    isShowAll(state,data) {
      state.isShowAll=!state.isShowAll;
    },
    SET_USER_INFO: (state, info) => {
      state.userInfo = info
    },  
    CHANGE_MESSAGE(state,msg){
      state.message = msg
    }
  },
  actions:{
    loadingAction({commit},n){
      commit('loading',n)
    }, 
    isShowAllAction({commit},n){
      commit('isShowAll',n)
    },
    setUserInfo ({ commit }, userInfo) {
      commit('SET_USER_INFO', userInfo)
    },
    changeMessage({ commit }, msg){
      commit('CHANGE_MESSAGE', msg)
    }
  }
}

export default user
