<template>
  <div class="cars-add">
    <FormCmp
      :formItem='formItems'
      :formModel='forms'
      ref="formCmpRef"
      label-width="100px"
    >
      <template #Date>
        <el-date-picker
          type="date"
          format="YYYY-MM-DD"
          placeholder="选择日期"
          @change="formatDate"
          v-model="forms.maintainDate"
        > </el-date-picker>
      </template>
      <template #WangEditor>
        <div ref="editor"></div>
      </template>
      <template #Energy>
        <el-form-item>
          <el-radio-group v-model="forms.energyType">
            <el-radio
              v-for="item in energyType"
              :key="item.value"
              :label="item.value"
            >{{item.label}}</el-radio>
          </el-radio-group>
          <div class="energy-progress">
            <div
              class="oil"
              v-if="forms.energyType == 3 || forms.energyType == 1"
            >
              <el-row>
                <el-col :span='1'>
                  <span>油量</span>
                </el-col>
                <el-col :span='8'>
                  <el-progress
                    :stroke-width='15'
                    :percentage='+forms.oil'
                    :color="progressColors"
                  ></el-progress>
                </el-col>
                <el-col :span='
                    2'>
                  <el-input
                    v-model='forms.oil'
                    type='number'
                    @input='input(`oil`)'
                    size='small'
                  ></el-input>
                </el-col>
              </el-row>
            </div>
            <div
              class="electron"
              v-if="forms.energyType == 3 || forms.energyType == 2"
            >
              <el-row>
                <el-col :span='1'>
                  <span>电量</span>
                </el-col>
                <el-col :span='8'>
                  <el-progress
                    :stroke-width='15'
                    :percentage='+forms.electric'
                    :color="progressColors"
                  ></el-progress>
                </el-col>
                <el-col :span='2'>
                  <el-input
                    v-model='forms.electric'
                    type='number'
                    @input='input(`electric`)'
                    size='small'
                  ></el-input>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form-item>
      </template>
      <template #CarsAttr>
        <div
          class="cars-attrlist"
          v-for="domain in domains"
          :key="domain.key"
        >
          <el-row :gutter='10'>
            <el-col :span='3'>
              <el-input v-model="domain.attr_key"></el-input>
            </el-col>
            <el-col :span='8'>
              <el-input v-model="domain.attr_value"></el-input>
            </el-col>
            <el-col :span='2'>
              <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-form-item>
          <el-button @click="addDomain">新增属性</el-button>
        </el-form-item>
      </template>
      <template #Button>
        <el-button
          type="primary"
          @click="onSubmit"
          :loading='loading'
        >{{button.Content}}</el-button>
      </template>
    </FormCmp>
    </div>
</template>

<script>
import { onBeforeMount, onMounted, reactive, ref,toRefs } from 'vue'
import { useStore } from 'vuex';
import { useRoute,useRouter } from "vue-router";
import WangEditor  from 'wangeditor'
import dayjs from 'dayjs'
import { ElMessage  } from 'element-plus';

import FormCmp from "@/components/form/index.vue";
import { GetCarsBrand,GetParking } from "@/api/common.js";
import { CarsAdd,CarsDetailed,CarsEdit } from "@/api/car.js";


export default {
    name:'CarsAdd',
    components:{
      FormCmp,
    },
    setup(){
      const editor = ref();
      let instance = null;

      const store = useStore();
      const year_check = store.state.config.year_check;
      const gear = store.state.config.gear;
      const energyType = store.state.config.energyType;
      const radio_disabled = store.state.config.radio_disabled;

      const route = useRoute();
      const router = useRouter();
      const id = ref('');
      id.value = route.query?.id;
      let loading = ref(false);

      const button = reactive({
        Content:'立即创建',
        Flag:'add',
      })
      
      const progressColors = reactive(
        [
          {color: '#f56c6c', percentage: 25},
          {color: '#e6a23c', percentage: 50},
          {color: '#409eff', percentage: 75},
          {color: '#5cb87a', percentage: 100}
        ]
      )

      const formItems =reactive(
        [
          {
            type:'select',label:'车辆品牌',placeholder:'请选择车辆品牌',width:'250px',
            prop:'carsBrandId',options:[],filterable:true,
            rules:{
              required:true,
              message:'请选择车辆品牌',
              trigger:'blur',
            }
          },
          {
            type:'select',label:'停车场',placeholder:'请选择停车场',width:'250px',
            prop:'parkingId',options:[],filterable:true,
            rules:{
              required:true,
              message:'请选择停车场',
              trigger:'blur',
            }
          },
          {
            type:'input',label:'车辆型号',placeholder:'请输入车辆型号',
            prop:'carsMode',width:'250px',
            rules:{
              required:true,
              message:'请输入车辆型号',
              trigger:'blur',
            }
          },
          {
            type:'input',label:'车牌号',placeholder:'请输入车牌号',
            prop:'carsNumber',width:'250px',
            rules:{
              required:true,
              message:'请输入车牌号',
              trigger:'blur',
            }
          },
          {
            type:'input',label:'车架号',placeholder:'请输入车架号',
            prop:'carsFrameNumber',width:'250px',
            rules:{
              required:true,
              message:'请输入车架号',
              trigger:'blur',
            }
          },
          {
            type:'input',label:'发动机号',placeholder:'请输入发动机号',
            prop:'engineNumber',width:'250px',
            rules:{
              required:true,
              message:'请输入发动机号',
              trigger:'blur',
            }
          },
          {
            type:'radio',label:'年检',
            prop:'yearCheck',options:year_check,
          },
          {
            type:'slot',slot:'Date',label:'保养日期',
            prop:'maintainDate',
            rules:{
              required:true,
              message:'请选择保养日期',
              trigger:'blur',
            }
          },
          {
            type:'radio',label:'挡位',
            prop:'gear',options:gear,
          },
          {
            type:'slot',slot:'Energy',label:'能源类型',
            prop:'energyType',
          },
          {
            type:'radio',label:'禁启用',
            prop:'status',options:radio_disabled,
          },
          {
            type:'slot',slot:'CarsAttr',label:'车辆属性',
            prop:'carsAttr',
          },
          { 
            type:'slot',slot:'WangEditor',label:'描述',
            prop:'content',
          },
          {
            type:'slot',slot:'Button'
          },

        ]
      )
      
      const forms = reactive(
        {
          carsBrandId:'',
          parkingId:'',
          carsMode:'',
          carsNumber:'',
          carsFrameNumber:'',
          engineNumber:'',
          yearCheck:false,
          maintainDate:'',
          gear:1,
          energyType:1,
          electric:0,
          oil:0,
          status:false,
          carsAttr:{},
          content:'',
        }
      )
      const formCmpRef =ref('');

      let domains = reactive([])
      const removeDomain =(item)=> {
        var index = domains.indexOf(item)
        if (index !== -1) {
          domains.splice(index, 1)
        }
      }
      const addDomain = () =>{
        domains.push({
          attr_key: '',
          attr_value: '',
          key: Date.now()
        });
      }
      // const annual = ref('have');
      const input = (type)=>{
          if(type==='oil'){
            if(forms.oil<0){
                forms.oil = 0;
            }
            if(forms.oil>=100){
                forms.oil = 100;
            }
          }
          if(type==='electric'){
            if(forms.electric<0){
                forms.electric = 0;
            }
            if(forms.electric>=100){
                forms.electric = 100;
            }
          }
          
      }

      onBeforeMount(()=>{
        getBrandList()
        getParkingList()
      })

      onMounted(()=>{
        instance = new WangEditor(editor.value);
        instance.config.onchange = html=>{
          forms.content = html;
        }
        instance.create() 
      })

      function getBrandList() {
        GetCarsBrand().then((response)=>{
          const data =response.data.data;
          if(data){
            data.forEach(item => {
              item.value = item.nameCh;
            });
            formItems[0].options = data;
          }
        })
      }

      function getParkingList() {
        GetParking().then((response)=>{
          const data =response.data.data;
          if(data){
            data.forEach(item => {
              item.value = item.parkingName;
            });
            formItems[1].options = data;
          }
        })
      }
      
      function  addCars() {
        loading.value = true;
        CarsAdd(forms).then((response)=>{
          ElMessage({
            message: response.message,
            type: "success",
          }),
          reset()
        }).catch((err)=>{
          ElMessage({
            message: err.message,
            type: "error",
          })  
        }).finally(()=>{
          loading.value = false;
        })
      }

      function editCars() {
        loading.value = true;
        const data = forms;
        data.id = id.value;
        CarsEdit(data).then((response)=>{
          ElMessage({
            message: response.message,
            type: "success",
          }),
          reset()
          router.push({
            name:'CarsList'
          })
        }).catch((err)=>{
          ElMessage({
            message: err.message,
            type: "error",
          })  
        }).finally(()=>{
          loading.value = false;
        })
      }

      function formatDomains() {
        const data = {};
        domains.forEach(item=>{
          if(item.attr_key){
            data[item.attr_key] = item.attr_value;
          }
        })
        forms.carsAttr = JSON.stringify(data);
      }

      function onSubmit() {
        formatDomains()
        formCmpRef.value.formValidate().then(()=>{
            // console.log(data);
            button.Flag === 'add'?addCars():editCars()
        }).catch(()=>{
          ElMessage({
            message: '请检查数据是否缺失或有误',
            type: "error",
          })
        })
      }

      function getDetaile(){
        CarsDetailed({id:id.value}).then((response)=>{
          const data = response.data;
          console.log(data);
          button.Content = '立即修改';
          button.Flag = 'edit';
          forms.carsBrandId=data.carsBrandId;
          forms.parkingId=data.parkingId;
          forms.carsMode=data.carsMode;
          forms.carsNumber=data.carsNumber;
          forms.carsFrameNumber=data.carsFrameNumber;
          forms.engineNumber=data.engineNumber;
          forms.yearCheck=data.yearCheck;
          forms.maintainDate=data.maintainDate;
          forms.gear=data.gear;
          forms.energyType=data.energyType;
          forms.electric=data.electric;
          forms.oil=data.oil;
          forms.status=data.status;
          forms.carsAttr=data.carsAttr;
          if(data.carsAttr){
            const parseData = JSON.parse(data.carsAttr)
            for (const key in parseData) {
              domains.push({
                attr_key: key,
                attr_value: parseData[key],
                key: Date.now()
              })
            }
            console.log(domains);
          }
          // domains = data.carsAttr;
          forms.content=data.content;
          instance.txt.html(data.content)
        }).catch((err)=>{
           ElMessage({
            message: err.message,
            type: "error",
          })
        })
      }

      function formatDate() {
        forms.maintainDate = dayjs(forms.maintainDate).format('YYYY-MM-DD')
      }

      function reset() {
        formCmpRef.value.resetForm()
        forms.energyType=1;
        forms.electric=0;
        forms.oil=0;
        forms.carsAttr={};
        forms.content='';
        domains.length = 0;
        instance.txt.clear()
        button.Flag='add';
        button.Content ='立即创建'
      }

      onBeforeMount(()=>{
        if(id.value){
          getDetaile();
        }
      })
      
      return{
        forms,
        formCmpRef,
        progressColors,
        input,
        removeDomain,
        addDomain,
        domains,
        editor,
        formItems,
        button,
        loading,
        onSubmit,
        formatDate,
        energyType
      }
    }
}
</script>

<style lang="scss">
.cars-add {
  .el-form-item {
    display: block;
    text-align: left;
  }
  .address-map {
    width: 100%;
    height: 250px;
    border: 1px solid #ccc;
  }
}
.oil,
.electron {
  .el-row {
    align-items: center !important;
  }
}
.oil {
  margin-bottom: 10px;
}
.cars-attrlist {
  margin-bottom: 10px !important;
}
</style>