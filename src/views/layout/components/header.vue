<template>
  <div id="header-wrap">
      header
  </div>
</template>

<script>
export default {

}
</script>
<style lang="scss">
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: $navWidth;
  height: $headerHeight;
  z-index: 4;
  background-color: #fff;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
}
</style>