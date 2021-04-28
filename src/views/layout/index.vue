<template>
  <div>
      <LayoutNavigator />
      <LayoutHeader />
      <LayoutContent />
  </div>
</template>

<script>
import LayoutHeader from "./components/header";
import LayoutContent from "./components/main";
import LayoutNavigator from "./components/navbar";

export default {
    name: 'layout',
    components:{
        LayoutHeader,
        LayoutContent,
        LayoutNavigator,
    },
    setup(){
        
    }
}
</script>

<style lang="scss">
</style>