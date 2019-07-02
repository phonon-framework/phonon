<template>
  <!-- Modal -->
  <div class="modal" id="exampleTopModal" data-config="center: false" tabindex="-1" role="modal">
    <div class="modal-inner" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="icon-close" data-dismiss="modal" aria-label="Close">
            <span class="icon" aria-hidden="true"></span>
          </button>
        </div>
        <div class="modal-body">
          <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
});
</script>

<!--
You can also import the Modal component only instead of
importing the global phonon bundle in App.vue
See below example

<script lang="ts">
import Vue from 'vue';

import Modal from 'phonon/dist/js/components/modal';

export default Vue.extend({
  data() {
    return {
      modal: null,
    };
  },
  async created() {
    await this.$nextTick();
    // this.modal = new Modal(this.$el);
  },
});
</script>
--!
