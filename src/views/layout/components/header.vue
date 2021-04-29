<template>
  <div
    class="header-wrap"
    :class="{'min-header':collapse}"
  >
    <el-row>
      <el-col :span="12">
        <span
          class="menu-btn"
          @click="switchAside($event)"
        >
          <svg-icon
            icon_Name="menuBtn"
            icon_Class="icon-menu-btn"
          ></svg-icon>
        </span>
      </el-col>
      <el-col
        :span="12"
        class="info-logout"
      >
        <div class="face-info">
          <img
            src="@/assets/face.png"
            :alt="username"
          >
          <span class="name">{{ username }}</span>
        </div>
        <span
          class="logout"
          @click="logout"
        >
          <svg-icon
            icon_Name="logout"
            icon_Class="icon-logout"
          ></svg-icon>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage,ElMessageBox  } from "element-plus";
export default {
  name: "LayoutAsice",
  components: {},
  props: {},
  setup(){
    const store = useStore();
    const router = useRouter();

    const switchAside = ((e) => { 
        if(e.target.nodeName==='svg' || e.target.nodeName==='use'){
          store.commit('app/SET_COLLAPSE'); 
        }else{
          return false
        }
      }
     )
    const username = computed(() => store.state.app.username);
    const collapse = computed(() => store.state.app.collapse);

    const logout = (() => {
      ElMessageBox('确认退出管理后台', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('app/logoutAction').then(response => {
          ElMessage({
            message: response.message,
            type: "success"
          })
          router.push({
            name: "Login"
          })
        })
      });
    })
    return { switchAside, username, logout, collapse }
  }
}
</script>
<style lang="scss">
.header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: $navWidth;
  height: $headerHeight;
  background-color: #fff;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);

  .menu-btn {
    display: block;
    text-align: left;
    color: #000;
    padding-left: 20px;
    padding-top: 24px;
    font-size: 24px;
    svg {
      cursor: pointer;
    }
  }
  .info-logout {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .logout {
    border-left: 2px solid #ededed;
    width: 64;
    text-align: center;
    line-height: 75px;
    font-size: 25px;
    padding-left: 20px;
    padding-right: 12px;
    cursor: pointer;
  }
  .face-info {
    padding: 0 30px 0 0;
    img {
      display: inline-block;
      height: 50px;
      vertical-align: middle;
      border-radius: 100px;
      margin-right: 18px;
    }
  }
}
.min-header {
  left: $navminWidth !important;
}
</style>