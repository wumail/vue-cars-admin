<template>
  <div class="cars-add">
    <FormCmp
      :formItem='formItems'
      :formModel='forms'
      :rules='rules'
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
            <el-radio :label="1">油</el-radio>
            <el-radio :label="2">电</el-radio>
            <el-radio :label="3">混合</el-radio>
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
    <!-- <el-form
      ref="form"
      label-width="100px"
    >
      <el-form-item label="车辆品牌">
        <el-select
          v-model="brand"
          placeholder="请选择"
        >
          <el-option
            label='奔驰'
            value='benz'
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="型号">
        <el-select
          v-model="modle"
          placeholder="请选择"
        >
          <el-option
            label='g500'
            value='benz-g500'
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="停车场">
        <el-select
          v-model="parking"
          placeholder="请选择"
        >
          <el-option
            label='太白停车场'
            value='taibaiparking'
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="车牌号">
        <el-input></el-input>
      </el-form-item>

      <el-form-item label="车架号">
        <el-input></el-input>
      </el-form-item>

      <el-form-item label="发动机号">
        <el-input></el-input>
      </el-form-item>

      <el-form-item label="年检">
        <el-radio-group v-model="annual">
          <el-radio :label="'have'">已检</el-radio>
          <el-radio :label="'havent'">未检</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="保养日期">
        <el-row :gutter='30'>
          <el-col :span='6'>
            <el-input v-model="date"></el-input>
          </el-col>
          <el-col :span='12'>下次保养日期</el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="档位">
        <el-radio-group v-model="gear">
          <el-radio :label="'automatic'">自动档</el-radio>
          <el-radio :label="'manual'">手动档</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="能源类型">
        <el-radio-group v-model="energy">
          <el-radio :label="1">油</el-radio>
          <el-radio :label="2">电</el-radio>
          <el-radio :label="3">混合</el-radio>
        </el-radio-group>
        <div class="energy-progress">
          <div
            class="oil"
            v-if="energy == 3 || energy == 1"
          >
            <el-row>
              <el-col :span='1'>
                <span>油量</span>
              </el-col>
              <el-col :span='8'>
                <el-progress
                  :stroke-width='15'
                  :percentage="percentage"
                  :color="progressColors"
                ></el-progress>
              </el-col>
              <el-col :span='2'>
                <el-input
                  v-model="percentage"
                  type='number'
                  @input='input'
                  size='small'
                ></el-input>
              </el-col>
            </el-row>
          </div>
          <div
            class="electron"
            v-if="energy == 3 || energy == 2"
          >
            <el-row>
              <el-col :span='1'>
                <span>电量</span>
              </el-col>
              <el-col :span='8'>
                <el-progress
                  :stroke-width='15'
                  :percentage="percentage"
                  :color="progressColors"
                ></el-progress>
              </el-col>
              <el-col :span='2'>
                <el-input
                  v-model="percentage"
                  type='number'
                  @input='input'
                  size='small'
                ></el-input>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form-item>

      <el-form-item
        v-for="(domain, index) in domains"
        :label="'车辆属性' + (index+1)"
        :key="domain.key"
      >
        <el-row :gutter='30'>
          <el-col :span='8'>
            <el-input v-model="domain.value"></el-input>
          </el-col>
          <el-col :span='2'>
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </el-col>
        </el-row>

      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain">新增属性</el-button>
      </el-form-item>

      <el-form-item label="描述">
        <div ref="editor"></div>
      </el-form-item>

      <el-form-item label="禁启用">
        <el-radio-group v-model="disabled">
          <el-radio :label="'禁用'"></el-radio>
          <el-radio :label="'启用'"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">立即创建</el-button>
      </el-form-item>
    </el-form> -->
  </div>
</template>

<script>
import { onBeforeMount, onMounted, reactive, ref,toRefs } from 'vue'
import { useStore } from 'vuex';
import WangEditor  from 'wangeditor'
import dayjs from 'dayjs'
import { ElMessage  } from 'element-plus';

import FormCmp from "@/components/form/index.vue";
import { GetCarsBrand,GetParking } from "@/api/common.js";
import { CarsAdd } from "@/api/car.js";


export default {
    name:'CarsAdd',
    components:{
      FormCmp,
    },
    setup(){
      const editor = ref();
      let instance = null;
      // const forms = reactive({
      //     brand: '',
      //     parking: '',
      //     modle: '',
      //     carsnum1: '',
      //     carsnum2: '',
      //     carsnum3: '',
      //     date:'',
      //     energy:1,
      //     annual:'have',
      //     gear:'manual',
      //     disabled:'禁用',
      // })
      // const form = toRefs(forms);

      const store = useStore();
      const year_check = store.state.config.year_check;
      const gear = store.state.config.gear;
      const energyType = store.state.config.energyType;
      const radio_disabled = store.state.config.radio_disabled;
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
            prop:'carsBrandId',options:[]
          },
          {
            type:'select',label:'停车场',placeholder:'请选择停车场',width:'250px',
            prop:'parkingId',options:[]
          },
          {
            type:'input',label:'车辆型号',placeholder:'请输入车辆型号',
            prop:'carsMode',width:'250px'
          },
          {
            type:'input',label:'车牌号',placeholder:'请输入车牌号',
            prop:'carsNumber',width:'250px'
          },
          {
            type:'input',label:'车架号',placeholder:'请输入车架号',
            prop:'carsFrameNumber',width:'250px'
          },
          {
            type:'input',label:'发动机号',placeholder:'请输入发动机号',
            prop:'engineNumber',width:'250px'
          },
          {
            type:'radio',label:'年检',
            prop:'yearCheck',options:year_check
          },
          {
            type:'slot',slot:'Date',label:'保养日期',
            prop:'maintainDate',
          },
          {
            type:'radio',label:'挡位',
            prop:'gear',options:gear
          },
          {
            type:'slot',slot:'Energy',label:'能源类型',
            prop:'energyType'
          },
          {
            type:'radio',label:'禁启用',
            prop:'status',options:radio_disabled
          },
          {
            type:'slot',slot:'CarsAttr',label:'车辆属性',
            prop:'carsAttr'
          },
          { 
            type:'slot',slot:'WangEditor',label:'描述',
            prop:'content'
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
          yearCheck:true,
          maintainDate:'',
          gear:true,
          energyType:'',
          electric:0,
          oil:0,
          status:true,
          carsAttr:{},
          content:'',
        }
      )
      const formCmpRef =ref('');

      const domains = reactive([])
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
        CarsAdd().then((response)=>[
          ElMessage({
            message: response.message,
            type: "success",
          })
        ]).catch((err)=>{
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
        addCars(forms)
        // console.log(domains);
        console.log(forms);
      }

      function formatDate() {
        forms.maintainDate = dayjs(forms.maintainDate).format('YYYY-MM-DD')
      }
      
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
        formatDate
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