<template>
  <div
    class="nav-wrap"
    :class="{'min-nav':collapse}"
  >
    <h1 class="logo"><img
        src="../../../assets/logo.png"
        alt=""
        :class="{'mini-logo': collapse}"
      ></h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="collapse"
      background-color='transparent'
      active-text-color='#fff'
      text-color='#fff'
      router
    >
      <template v-for="(item,index) in routes">
        <el-submenu
          v-if="!item.hidden"
          :key="item.id"
          :index="index+''"
        >
          <template #title>
            <div class="nav-icon-span">
              <svg-icon
                :icon_Name='item.meta.icon'
                :icon_Class="item.meta && item.meta.icon_class"
              />
              <span>{{item.meta?item.meta.title :''}}</span>
            </div>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="subitem in item.children"
              :key="subitem.id"
              :index="subitem.path"
            >{{subitem.meta.name}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>

  </div>
</template>

<script>
import { reactive, ref , computed } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
    name:'navbar',
    setup(){
        const router = useRouter();
        const routes = reactive(router.options.routes);
        const store = useStore();

        const isCollapse = ref(false);

        const handleClose = ()=>{

        }
        const handleOpen = () =>{

        }

        const collapse = computed(() => store.state.app.collapse);
        return{
            // router,
            routes,
            isCollapse,
            handleClose,
            handleOpen,
            collapse,
        }
    }
}
</script>

<style lang="scss">
.nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navWidth;
  height: 100vh;
  z-index: 5;
  background-color: #344a5f;
  @include webkit(transition, all 0.3s ease 0s);
  .logo {
    img {
      margin: auto;
      height: 72px;
      padding-bottom: 20px;
      @include webkit(transition, all 0.3s ease 0s);
    }
    .mini-logo {
      height: 50px;
    }
  }
  .el-menu-vertical-demo {
    text-align: left;
  }
  .nav-icon-span {
    display: flex;
  }
}
.min-nav {
  width: $navminWidth !important;
}
</style>