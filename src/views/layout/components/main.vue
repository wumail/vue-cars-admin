<template>
  <div
    class="main-wrap"
    :class="{'min-main':collapse}"
  >
    <router-view />
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
    name:'MainContent',
    setup(){
      const store = useStore();
      const collapse = computed(() => store.state.app.collapse);
      return{
        collapse,
      }
    }
}
</script>

<style lang="scss">
.main-wrap {
  position: fixed;
  left: $navWidth;
  top: $headerHeight;
  right: 0;
  bottom: 0;
  border: 20px solid #f7f7f7;
  padding: 10px;
  @include webkit(box-sizing, border);
  @include webkit(transition, all 0.3s ease 0s);
}
.min-main {
  left: $navminWidth !important;
}
</style>