<template>
  <div class="cars-dialog">
    <el-dialog
      title="新增车辆品牌"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      destroy-on-close
      center
      @opened='opened'
      @closed='closed'
    >
      <FormCmp
        ref="formCmpRef"
        :formItem='formItems'
        :formModel='forms'
      >
        <template #LOGO>
          <div class="upload-img-wrap">
            <div class="upload-img">
              <img
                v-show="dialogModel.current_logo.img"
                :src="dialogModel.current_logo.img"
              >
            </div>
            <ul class="img-list">
              <li
                v-for="item in dialogModel.logo"
                :key="item.id"
              >
                <img
                  :src="item.img"
                  :alt="item.name"
                  @click="selectLogo(item.img)"
                >
              </li>
            </ul>
          </div>
        </template>
        <template #Button>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              :loading='loading'
            >{{button.Content}}</el-button>
          </el-form-item>
        </template>
      </FormCmp>
      <!-- <el-form
        ref="form"
        label-width="100px"
        :model='forms'
      >
        <el-form-item
          label="品牌中文"
          prop='nameCh'
        >
          <el-input v-model="forms.nameCh"></el-input>
        </el-form-item>

        <el-form-item
          label="品牌英文"
          prop='nameEn'
        >
          <el-input v-model="forms.nameEn"></el-input>
        </el-form-item>

        <el-form-item
          label="LOGO"
          prop='imgUrl'
        >
          <div class="upload-img-wrap">
            <div class="upload-img">
              <img
                v-show="dialogModel.current_logo.img"
                :src="dialogModel.current_logo.img"
              >
            </div>
            <ul class="img-list">
              <li
                v-for="item in dialogModel.logo"
                :key="item.id"
              >
                <img
                  :src="item.img"
                  :alt="item.name"
                  @click="selectLogo(item.img)"
                >
              </li>
            </ul>
          </div>
        </el-form-item>

        <el-form-item
          label="禁启用"
          prop='status'
        >
          <el-radio-group v-model="forms.status">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="描述"
          prop='content'
        >
          <el-input
            type='textarea'
            v-model="forms.content"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            :loading='loading'
          >{{button.Content}}</el-button>
        </el-form-item>
      </el-form> -->
    </el-dialog>
  </div>
</template>

<script>
import { inject, onMounted, reactive, ref, toRef, toRefs,nextTick } from 'vue';
import { useStore } from "vuex";
import { ElMessage  } from 'element-plus';

import FormCmp from "@/components/form/index.vue";
import { BrandLogo,BrandAdd,BrandEdit,BrandDetailed } from "@/api/brand.js";
// import { resetForm } from "@/utils/common.js";

export default {
    name:'AddCars',
    components:{
      FormCmp,
    },
    emits:['brandCallback','brandInfoClear'],
    props:{
      brand_info:{
        type:Object,
        default:()=>{}
      }
    },
    setup(props,{emit}){
        const store = useStore();
        const radio_disabled = store.state.config.radio_disabled;
        const dialogVisible = inject('dialogVisible');
        const info = Object.assign({},props.brand_info);

        const forms = reactive({
          nameCh: '',
          nameEn: '',
          content: '',
          status: true,
          imgUrl:'',
        })

        const formItems =reactive(
          [
            {
              type:'input',label:'品牌中文',placeholder:'品牌中文',
              prop:'nameCh',
            },
            {
              type:'input',label:'品牌英文',placeholder:'品牌英文',
              prop:'nameEn',
            },
            {
              type:'slot',slot:'LOGO',label:'LOGO',
              prop:'imgUrl'
            },
            {
              type:'radio',label:'禁启用',
              prop:'status',options:radio_disabled
            },
            {
              type:'input',input_type:'textarea',label:'描述',
              prop:'content',
            },
            {
              type:'slot',slot:'Button'
            },
          ]
        )
        const dialogModel = reactive(
          {
            logo_flag:false,
            logo: [],
            current_logo:{
              img:'',
            }
          }
        )

        const form = ref('')
        const formCmpRef = ref('')
        // const models = toRefs(dialogModel);
        const loading = ref(false)

        const button = reactive({
            Content:'立即创建',
            Flag:'add',
        })

        const closed = ()=>{
          reset()
        }

        const opened = ()=>{
          getBrandLogo()
          if(props.brand_info.id){
            getBrandDetail()
          }
        }

        function getBrandLogo(){
          if(!dialogModel.logo_flag){
            BrandLogo().then((response)=>{
              const data = response.data;
              dialogModel.logo = data?data:[];
              dialogModel.logo_flag = true;
              // console.log(dialogModel.logo);
            }).catch(()=>{
  
            }).finally(()=>{
  
            })
          }
        }

        function getBrandDetail(){
          if (props.brand_info) {
            const data = props.brand_info;
            forms.nameCh = data.nameCh;
            forms.nameEn = data.nameEn;
            forms.content = data.content;
            forms.status = data.status;
            forms.imgUrl = data.imgUrl;
            dialogModel.current_logo.img = data.imgUrl;
            button.Content = '立即修改';
            button.Flag = 'edit';
          }

          // if(props.brand_id){
          //   BrandDetailed({id:props.brand_id}).then((response)=>{
          //     const data = response.data;
          //     if(data){
          //       forms.nameCh = data.nameCh;
          //       forms.nameEn = data.nameEn;
          //       forms.content = data.content;
          //       forms.status = data.status;
          //       forms.imgUrl = data.imgUrl;
          //       dialogModel.current_logo.img = data.imgUrl;
          //       button.Content = '立即修改';
          //       button.Flag = 'edit';
          //     }
          //   }).catch(()=>{
          //   }).finally(()=>{
          //   })
          // }
        }

        function onSubmit(){
          let {nameCh,nameEn,status,imgUrl} = forms;
          const data = {
              nameCh,
              nameEn,
              status,
              imgUrl,
          }
          button.Flag === 'add'? addBrand(data): editBrand(data);
        }

      
        function editBrand(data){
          loading.value = true;
          data.id = props.brand_info.id;
          BrandEdit(data).then(response=>{
            ElMessage({
              message: response.message,
              type: "success",
            })
            reset();
          }).catch((err)=>{
            ElMessage({
              message: err.message,
              type: "error",
            })
          }).finally(()=>{            
            loading.value = false;
            emit('brandCallback',{function:'search'})
          })
        }

        function addBrand(data){
          loading.value = true;
          BrandAdd(data).then((response)=>{
            ElMessage({
              message: response.message,
              type: "success",
            })
            reset()
          }).catch((err)=>{
            ElMessage({
              message: err.message,
              type: "error",
            })
          }).finally(()=>{            
            loading.value = false;
            emit('brandCallback',{function:'search'})
          })
        }

        function selectLogo(url){
          dialogModel.current_logo.img = url;
          forms.imgUrl = url;
          // console.log(url);
        }

        function reset(){
          // initForms();
          dialogModel.current_logo.img = '';
          formCmpRef.value.resetForm();
          emit('brandInfoClear',{})
        }
        // onMounted(()=>{
        //     console.log(dialogVisible);
        // })
        return{
            props,
            form,
            forms,
            dialogModel,
            closed,
            dialogVisible,
            opened,
            onSubmit,
            selectLogo,
            button,
            loading,
            formItems,
            formCmpRef,
        }
    }
    
}
</script>

<style lang="scss">
</style>