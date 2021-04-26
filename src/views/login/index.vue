<template>
  <div class="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :class="{'current':item.current}"
          :key="item.id"
          @click="toggleMenu(item)"
        ><span>{{item.txt}}</span></li>
      </ul>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size='small'
      >
        <el-form-item prop="username">
          <label>邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <label>密码</label>
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="confirm_password"
          v-show="model === 'register'"
        >
          <label>确认密码</label>
          <el-input
            type="password"
            v-model="ruleForm.confirm_password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="vcode">
          <label>验证码</label>
          <el-row :gutter='10'>
            <el-col :span='16'>
              <el-input
                type="text"
                v-model="ruleForm.vcode"
                autocomplete="off"
              ></el-input>
            </el-col>
            <el-col :span='8'>
              <el-button
                type='success'
                class="block"
              >
                获取验证码
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            class="btn-block login-btn"
            @click="submitForm('ruleForm')"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { stripscript,validate_email,validate_pwd,validate_vcode } from "@/utils/validate.js";
export default {
    name:'login',
    data(){
        var validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else if(!validate_email(value)){
                callback(new Error('用户名格式不正确'));
            }else{
                callback();
            }
        };
        var validatePassword = (rule, value, callback) => {
            let value_bak = value;
            this.ruleForm.password = value = stripscript(value);
            // console.log(value);
            if (value === '') {
                callback(new Error('请输入密码'));
            }else if(value_bak !== value){
                this.ruleForm.password = '';
                callback(new Error('请重新输入,注意不要输入特殊字符'));
            }else if (!validate_pwd(value)) {
                callback(new Error('请入 >=6 并且 <= 20 位的密码，包含数字、字母"'));
            } else {
                callback();
            }
        };
        var validateVCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入验证码'));
            } else if (!validate_vcode(value)) {
                callback(new Error('验证码格式错误'));
            } else {
                callback();
            }
        };
        var validateConfrimPwd = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次密码'));
            }else if(value !== this.ruleForm.password){
                callback(new Error('两次输入密码不相同'));
            } else {
                callback();
            }
        };
        return{
            menuTab:[
                {txt:'登录',current:true,type:'login'},
                {txt:'注册',current:false,type:'register'},
            ],
            model:'login',
            ruleForm: {
                username: '',
                password: '',
                confirm_password:'',
                vcode: ''
            },
            rules: {
                username: [
                    { validator: validateEmail, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'blur' }
                ],
                vcode: [
                    { validator: validateVCode, trigger: 'blur' }
                ],
                confirm_password:[
                    { validator: validateConfrimPwd, trigger: 'blur' }
                ]
            },   
        }
    },
    created(){

    },
    mounted(){

    },
    methods:{
        toggleMenu(item){
            this.menuTab.forEach(element => {
                if(element.txt === item.txt){
                    element.current = true;
                }else{
                    element.current = false;
                }
            });
            this.model = item.type;
            this.$refs['ruleForm'].resetFields();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
    // watch:{

    // },
    // props:{

    // },
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