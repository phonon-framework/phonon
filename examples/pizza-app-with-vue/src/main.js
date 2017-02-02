// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.ignoredElements = ['home', 'page-two']

require('phonon/dist/css/phonon.min.css')
require('phonon/dist/js/phonon.js')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
