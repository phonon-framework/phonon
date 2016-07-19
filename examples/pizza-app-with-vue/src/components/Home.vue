<template>
	<home data-page="true">
		<header class="header-bar">
			<div class="center">
				<h1 class="title">Phonon + Vue</h1>
			</div>
		</header>
		<div class="content">

			<ul class="list">
				<li class="divider">Select a pizza</li>
				<li><a class="padded-list" href="#!page-two/margherita">Margherita</a></li>
				<li><a class="padded-list" href="#!page-two/calzone">Cheese Calzone</a></li>
				<li><a class="padded-list" href="#!page-two/pesto">Pesto Pizza</a></li>
				<li><a class="padded-list" href="#!page-two/roma">Roma</a></li>
				<li><a class="padded-list" href="#!page-two/prosciutto">Prosciutto</a></li>
				<li><a class="padded-list" href="#!page-two/funghi">Funghi</a></li>
			</ul>

		</div>
	</home>
</template>

<script>

	export default {

		props: {
			app: {
				type: Object,
				require: true
			}
		},

		ready() {
			this.app.on({page: 'home', preventClose: false, content: null})
		}
	}
</script>
