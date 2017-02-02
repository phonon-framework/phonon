<template>
  <div id="app">
    <home :app="app"></home>
    <page-two :app="app"></page-two>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import PageTwo from './components/PageTwo.vue'

export default {
  name: 'app',
  data () {
    return {
      app: phonon.navigator()
    }
  },

  mounted () {
    this.$nextTick(() => {
      phonon.options({
        navigator: {
          defaultPage: 'home',
          animatePages: true,
          enableBrowserBackButton: true
        },
        i18n: null // for this example, we do not use internationalization
      })

      window.setTimeout(() => {
        this.app.start()
      }, 500)
    })
  },

  components: {
    Home,
    PageTwo
  }
}
</script>
