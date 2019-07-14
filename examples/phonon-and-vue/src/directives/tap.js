import Vue from 'vue';

// directive to use tap events with VueJS
Vue.directive('tap', {
  isFn: true, // important!
  bind(el, bindings) {
    el.on('tap', bindings.value);
  },
});
