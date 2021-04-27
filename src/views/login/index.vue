<template>
  <div class="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menu_switch_item"
          :class="{'current':current_menu === item.type}"
          :key="item.type"
          @click="toggleMenu(item.type)"
        ><span>{{item.label}}</span></li>
      </ul>
      <el-form
        ref="form"
        :model="ruleForm"
        status-icon
        :rules="rules"
        class="login-form"
        size='small'
      >
        <el-form-item prop="username">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="confirm_password"
          v-show="current_menu === 'register'"
        >
          <label for="confirm_password">确认密码</label>
          <el-input
            id="confirm_password"
            type="password"
            v-model="ruleForm.confirm_password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="vcode">
          <label for="vcode">验证码</label>
          <el-row :gutter='10'>
            <el-col :span='16'>
              <el-input
                id="vcode"
                type="text"
                v-model="ruleForm.vcode"
                autocomplete="off"
              ></el-input>
            </el-col>
            <el-col :span='8'>
              <el-button
                type='success'
                class="block"
                :disabled="code_disabled"
                :loading="code_loading"
                @click="getSms"
              >
                {{ code_text }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            class="btn-block login-btn"
            :disabled="submit_disabled"
            @click="submitForm"
          >{{ current_menu === "login" ? "登录": "注册"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "js-sha1";
import { GetCode } from "@/api/login.js";
import { ElMessage  } from 'element-plus';
import { onMounted, reactive,ref } from "vue";
import { stripscript,validate_email,validate_pwd,validate_vcode } from "@/utils/validate.js";
export default {
    name:'login',
    setup(){
      //声明对象类型使用reactive
      const menu_switch_item = reactive([
        { type: "login", label: "登录" },
        { type: "register", label: "注册" }
      ])

      let current_menu = ref(menu_switch_item[0].type);
      let form = ref(null);

      let submit_disabled = ref(false);
      let code_text = ref("获取验证码");
      let code_loading = ref(false);
      let code_disabled = ref(false);
      let timer = ref(null);

      const ruleForm = reactive( {
          username: '',
          password: '',
          confirm_password:'',
          vcode: '',
      })

      const validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if(!validate_email(value)){
                callback(new Error('用户名格式不正确'));
            }else{
                callback();
            }
      }

      const validatePassword = (rule, value, callback) => {
          const value_bak = value;
          ruleForm.password = value = stripscript(value);
          // console.log(value);
          if (value === '') {
              callback(new Error('请输入密码'));
          }else if(value_bak !== value){
              ruleForm.password = '';
              callback(new Error('请重新输入,注意不要输入特殊字符'));
          }else if (!validate_pwd(value)) {
              callback(new Error('请入 >=6 并且 <= 20 位的密码，包含数字、字母"'));
          } else {
              callback();
          }
      }

      const validateVCode = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请输入验证码'));
          } else if (!validate_vcode(value)) {
              callback(new Error('验证码格式错误'));
          } else {
              callback();
          }
      }

      const validateConfrimPwd = (rule, value, callback) => {
        if(current_menu.value === 'login'){
          callback();
          return false;
        }else if (value === '') {
          callback(new Error('请再次密码'));
        }else if(ruleForm.password && value !== ruleForm.password){
          callback(new Error('两次输入密码不相同'));
        } else {
          callback();
        }
      }

      const rules = reactive( {
        username: [
            { validator: validateEmail, trigger: 'blur' }
        ],
        password: [
            { validator: validatePassword, trigger: 'blur' }
        ],
        confirm_password:[
            { validator: validateConfrimPwd, trigger: 'blur' }
        ],
        vcode: [
            { validator: validateVCode, trigger: 'blur' }
        ],
      })

      const getSms = (()=>{
        if(ruleForm.username === ''){
          ElMessage.error('邮箱不能为空');
          return false
        }
        if(!validate_email(ruleForm.username)) {
          ElMessage({
            message: "邮箱格式有误，请重新输入！！",
            type: "error"
          })
          return false;
        }
        let requestData = {
          username: ruleForm.username,
          module: current_menu.value
        };
        code_text.value = "发送中";
        code_loading.value = true;
        GetCode(requestData).then(response=>{
          submit_disabled.value = false;
          countdown(60);
        }).catch(()=>{
          code_text.value = '重新获取';
          
        }).finally(()=>{
          code_loading.value = false;
        })
      })

      const countdown = ((number) => {
        let second = number;
        // 禁用按钮
        code_disabled.value = true;
        // 按钮文本
        code_text.value = `${second}秒`;
        timer = setInterval(() => {
          second--;
          code_text.value = `${second}秒`;
          if(second < 0) {
            code_text.value = `重新获取`;
            // 启用按钮
            code_disabled.value = false;
            clearInterval(timer);
          }
        }, 1000)
      })
      
      const toggleMenu = ((type) => {
        current_menu.value = type;
        form.value.resetFields();
      })

      const submitForm = (() => {
        form.value.validate((valid) => {
            if (valid) {
                current_menu.value === 'login' ? login() : register();
            } else {
                console.log('error submit!!');
                return false;
            }
        })
      })

      const login = (() => {
        const requestData = {
          username: ruleForm.username,
          password: sha1(ruleForm.password),
          code: ruleForm.vcode
        }
        // root.$store.dispatch('app/loginAction', requestData).then(response => {
        //   ElMessage({
        //     message: response.message,
        //     type: "success"
        //   })
        //   // 页面跳转
        //   root.$router.push({ name: 'ConsoleIndex' })
        // }).catch(error => {
        //   // 重置数据
        //   reset();
        // })
      })
      // 注册
      const register = (() => {
        const requestData = {
          username: ruleForm.username,
          password: sha1(ruleForm.password),
          code: ruleForm.vcode
        }
        Register(requestData).then(response => {
          Elmessage({
            message: response.message,
            type: "success"
          })
        }).catch(error => {
          Elmessage({
            message: error.message,
            type: "error"
          })
        }).finally(()=>{
          reset();
        })
      })

      const reset = (() => {
      // 重置表单
        form.value.resetFields();
        // 修改模块
        current_menu.value = "login";
        // 判断定时器是否存在，存在则清除
        if(timer) { clearInterval(timer); }
        // 还原获取验码按钮状态
        code_disabled.value = false;
        code_text.value = "获取验证码";
      })
      // //生命周期
      // onMounted(() => {
      //   // 在渲染完成后, 这个 div DOM 会被赋值给 root ref 对象
      //   console.log(context) // <div/>
      // })
      return{
        form,
        menu_switch_item,
        current_menu,
        ruleForm,
        rules,
        toggleMenu,
        submitForm,
        getSms,
        code_text,
        code_loading,
        code_disabled,
        submit_disabled,
        login,
        register,
      }
    },
}
</script>

<style lang="scss">
.login {
  padding-top: 100px;
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 330px;
  margin: auto;
  .menu-tab {
    display: flex;
    text-align: center;
    li {
      width: 88px;
      line-height: 36px;
      font-size: 14px;
      color: rgba($color: #fff, $alpha: 0.8);
      border-radius: 2px;
      cursor: pointer;
    }
    .current {
      background-color: rgba(0, 0, 0, 0.1);
      @include webkit(box-shadow, inset 0px 0px 10px 1px rgba(0, 0, 0, 0.1));
    }
  }
  .login-form {
    margin-top: 30px;
    .el-form-item {
      width: 300px;
      label {
        display: block;
        margin-bottom: 3px;
        font-size: 14px;
        text-align: left;
        color: #fff;
      }
    }
  }
}
.login-btn {
  margin-top: 19px;
}
</style>