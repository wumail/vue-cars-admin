<template>
  <div id="nav-wrap">
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      background-color='transparent'
      active-text-color='#fff'
      text-color='#fff'
      router=true
    >
      <template
        v-for="(item,index) in routes"
        :index="index"
      >
        <el-submenu
          v-if="!item.hidden"
          :key="item.id"
        >
          <template #title>
            <span>{{item.meta.name}}</span>
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
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from "vue-router";
export default {
    name:'navbar',
    setup(){
        const router = useRouter();
        const routes = reactive(router.options.routes);

        const isCollapse = ref(false);

        const handleClose = ()=>{

        }
        const handleOpen = () =>[

        ]
        return{
            // router,
            routes,
            isCollapse,
            handleClose,
            handleOpen,
        }
    }
}
</script>

<style lang="scss">
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navWidth;
  height: 100vh;
  z-index: 5;
  background-color: #344a5f;
  .el-menu-vertical-demo {
    text-align: left;
  }
}
</style>