<template>
  <div class="cars-add">

    <el-form
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
    </el-form>
  </div>
</template>

<script>
import { onMounted, reactive, ref,toRefs } from 'vue'

import WangEditor  from 'wangeditor'
export default {
    name:'CarsAdd',
    components:{
      
    },
    setup(){
      const editor = ref();
      let instance = null;
      const forms = reactive({
          brand: '',
          parking: '',
          modle: '',
          carsnum1: '',
          carsnum2: '',
          carsnum3: '',
          date:'',
          energy:1,
          annual:'have',
          gear:'manual',
          disabled:'禁用',
      })
      const form = toRefs(forms);

      const formItems =reactive(
        [
          {
            type:'input',label:'停车场名称',placeholder:'请输入停车场名称',
            prop:'parkingName',width:'250px'
          },
          {
            type:'slot',slot:'CityArea',label:'区域',
            prop:'area'
          },
        ]
      )
      
      
      const domains = reactive(
        [  
         {
            value: '',
          }
        ]
      )

      // const annual = ref('have');
      const percentage = ref(10);
      const progressColors = reactive(
        [
          {color: '#f56c6c', percentage: 30},
          {color: '#e6a23c', percentage: 70},
          {color: '#5cb87a', percentage: 100}
        ]
      )

      const input = ()=>{
          if(percentage.value<0){
              percentage.value = 0;
          }
          if(percentage.value>=100){
              percentage.value = 100;
          }
      }
      
      const removeDomain =(item)=> {
        var index = domains.indexOf(item)
        if (index !== -1) {
          domains.splice(index, 1)
        }
      }

      const addDomain = () =>{
        domains.push({
          value: '',
          key: Date.now()
        });
      }

    //   const log=()=>{
    //       console.log(energy.value);
    //   }

      onMounted(()=>{
      instance = new WangEditor(editor.value);
      instance.create() 
    })
      
      return{
        ...form,
        progressColors,
        percentage,
        input,
        removeDomain,
        addDomain,
        domains,
        editor,
        formItems,
        // energy,
        // annual,
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
</style>