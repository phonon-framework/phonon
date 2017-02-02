<template>
  <page-two data-page="true">
    <header class="header-bar">
      <div class="left">
        <button class="btn pull-left icon icon-arrow-back" data-navigation="$previous-page"></button>
        <h1 class="title">Page Two</h1>
      </div>
    </header>

    <div class="content">
      <div class="padded-full">

        <h2>Order</h2>

        <p>1x Pizza: {{ pizza }}</p>

        <button class="btn negative cancel" data-order="cancel" v-tap="onAction">Cancel</button>
        <button class="btn btn-flat primary order" data-order="order" v-tap="onAction">Order</button>
      </div>
    </div>
  </page-two>
</template>

<script>
import Vue from 'vue'

// Directive to use tap events with VueJS
Vue.directive('tap', {
  isFn: true, // important!
  bind: function (el, bindings) {
    el.on('tap', bindings.value)
  }
})

export default {
  name: 'PhononPageTwo',
  props: {
    app: {
      type: Object,
      require: true
    }
  },

  data () {
    return {
      pizza: '',
      action: null
    }
  },

  mounted () {
    /*
     * Phonon also supports objects
     * With VueJS, it is better to use "this"
     * instead of a callable function like other examples
     * If Phonon finds page events, it will call them
     * here we want to use onClose, onHidden and onHashChanged methods
     */
    this.app.on({page: 'page-two', preventClose: true}, this)
  },

  methods: {
    onClose (self) {
      if (this.action !== null) {
        self.close()
      } else {
        phonon.alert('Before leaving this page, you must perform an action.', 'Action required')
      }
    },

    onHidden () {
      this.action = null
    },

    onHashChanged (pizza) {
      this.pizza = pizza
    },

    onAction (event) {
      this.action = 'user-action'

      if (event.target.getAttribute('data-order') === 'order') {
        phonon.alert('Thank you for your order!', 'Dear customer')
      } else {
        phonon.alert('Your order has been canceled.', 'Dear customer')
      }
    }
  }
}
</script>
