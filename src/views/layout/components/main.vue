<template>
  <div id="main-wrap">
    <router-view />
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
#main-wrap {
  position: fixed;
  left: $navWidth;
  top: $headerHeight;
  right: 0;
  bottom: 0;
  border: 20px solid #f7f7f7;
  padding: 10px;
  @include webkit(box-sizing, border);
}
</style>