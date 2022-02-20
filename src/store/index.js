import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
function setToken(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
function getToken(token) {
  localStorage.getItem(JSON.parse(token))
}
function clearToken(token) {
  localStorage.clear(token)
}
export default new Vuex.Store({
  state: {
    token: getToken || ''
  },
  mutations: {
    setToken: (key, value) => {
      console.log(key, value)
      setToken(key, value)
    },
    getToken: (key) => {
      return getToken(key)
    },
    clearToken: (key) => {
      clearToken(key)
    }
  },
  actions: {},
  modules: {}
})