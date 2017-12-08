import axios from 'axios'
import vue from 'vue'
import vuex from 'vuex'
import router from '../router'
import $ from 'jquery'
let base = window.location.host.indexOf('localhost') > -1 ? '//localhost:3000/' : '/'

let api = axios.create({
  baseURL: base + 'api/',
  timeout: 2000,
  withCredentials: true
})

let auth = axios.create({
  baseURL: base,
  timeout: 2000,
  withCredentials: true
})

vue.use(vuex)

var store = new vuex.Store({
  state: {
    boards: [],
    todos: [],
    results: [],
    activeBoard: {},
    error: {},
    user: {},
    weather: {},
    quote: {}
  },
  mutations: {
    handleError(state, err) {
      state.error = err
    },
    setUser(state, user) {
      state.user = user
    },
    setWeather(state, data) {
      state.weather = data
    },
    setTodos(state, data) {
      state.results = data
    },
    setQuote(state, data) {
      state.quote = data
    }
  },
  actions: {
    //when writing your auth routes (login, logout, register) be sure to use auth instead of api for the posts
    //USER LOGIN/REGISTER/LOGOUT
    login({ commit, dispatch }, user) {
      auth.post('login', user)
        .then(res => {
          console.log('Response to login: ', res)
          if (!res.data.error) {
            commit('setUser', res.data.data)
            router.push({ name: 'Home' })
          } else {
            commit('handleError', res.data)
          }
        })
        .catch(err => {
          commit('handleError', err)
        })
    },

    register({ commit, dispatch }, payload) {
      if (payload.image === '') {
        delete payload.image
      }
      auth.post('register', payload)
        .then(res => {
          commit('setUser', res.data.data)
          dispatch('authenticate')
        })
    },

    authenticate({ commit, dispatch }) {
      auth('authenticate')
        .then(res => {
          commit('setUser', res.data.data)
          router.push({ name: 'Home' })
        })
        .catch(err => {
          router.push({ name: 'Login' })
        })
    },

    logout({ commit, dispatch }) {
      auth.delete('logout')
        .then(res => {
          commit('setUser', {})
          router.push({ name: 'Login' })
          console.log(res)
        })

    },
    //GET API DATA
    getWeather({ commit, dispatch }) {
      api('/weather')
        .then(res => {
          commit('setWeather', res.data)
        })
        .catch(commit('handleError', Error))
    },
    getTodos({ commit, dispatch }) {
      api('/todos')
        .then(res => {
          commit('setTodos', res.data)
        })
        .catch(commit('handleError', Error))
    },
    addTodo({ commit, dispatch }, todo) {
      api.post('/todos', todo)
        .then(res => {
          dispatch('getTodos')
        })
    },
    removeTodo({ commit, dispatch }, id) {
      api.delete('/todos/' + id)
        .then(res => {
          dispatch('getTodos')
        })
    },
    getQuote({ commit, dispatch }) {
      api('/quote')
        .then(res => {
          commit('setQuote', res.data)
        })
        .catch(commit('handleError', Error))
    },

    //Profile
    updateProfile({ commit, dispatch }, payload) {
      if(payload.image === ''){
        delete payload.image
      }
      if(payload.name === ''){
        delete payload.name
      }
      if(payload.background === ''){
        delete payload.background
      }
      if(payload.password === ''){
        delete payload.password
      }
      if(payload.email === ''){
        delete payload.email
      }
      api.put('/users/' + payload.userId, payload)
        .then(res => {
          console.log(res)
          dispatch('authenticate')
        })
    }

  }


})


export default store