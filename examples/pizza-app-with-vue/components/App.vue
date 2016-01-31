<template>
	<home :app="app"></home>
	<page-two :app="app"></page-two>
</template>

<script>

	import Home from './Home.vue'
	import PageTwo from './PageTwo.vue'

	export default {

		data() {
			return {
				app: phonon.navigator()
			}
		},

 		ready: function () {

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

		components: { Home, PageTwo }
	}
</script>
