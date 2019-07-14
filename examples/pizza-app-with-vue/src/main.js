import Vue from 'vue';
import App from './App.vue';

// Directives
import './directives/tap';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
