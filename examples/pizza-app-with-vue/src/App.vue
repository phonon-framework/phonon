<template>
  <div id="app">
    <home :app="app" />
    <page-two :app="app" />
  </div>
</template>

<script>
import 'phonon/dist/css/phonon.css'

import phonon from 'phonon/dist/js/phonon-core'
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
    phonon.options({
      navigator: {
        defaultPage: 'home',
        animatePages: true,
        enableBrowserBackButton: true
      },
      i18n: null // for this example, we do not use internationalization
    })

    this.app.start()
  },
  components: {
    Home,
    PageTwo
  }
}
</script>
