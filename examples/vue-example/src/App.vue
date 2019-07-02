<template>
  <div id="app">
    <!-- Button trigger modal -->
    <button class="btn btn-primary" data-toggle="modal" data-target="#exampleTopModal">Launch modal</button>

    <CustomModal />
  </div>
</template>

<script lang="ts">
// Style
import 'phonon/dist/css/phonon.css';

/**
 * Phonon bundle will detect elements created by the virtual DOM
 * If you prefer to use components, please include the component in specific files
 * See components/CustomModal.vue for more information
 */
import 'phonon/dist/js/phonon';

import Vue from 'vue';
import CustomModal from './components/CustomModal.vue';

export default Vue.extend({
  name: 'app',
  components: {
    CustomModal,
  },
});
</script>

<style>
#app {
  text-align: center;
  margin-top: 60px;
}
</style>
