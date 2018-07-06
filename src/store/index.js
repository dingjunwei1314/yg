import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import select from './modules/select'
import workorder from './modules/workorder'
import permission from './modules/permission'
import filterForm from './modules/filterForm'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    permission,
    select,
    workorder,
    filterForm
  },
  getters
})

export default store
