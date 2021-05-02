<template>
  <div class="parking-add">
    <el-form
      :model='forms'
      :rules='rules'
      ref="parking_form"
      label-width="100px"
    >
      <el-form-item
        label="停车场名称"
        prop='name'
      >
        <el-input v-model="name"></el-input>
      </el-form-item>

      <el-form-item
        label="区域"
        prop='area'
      >
        <CityArea
          ref="parkingadd_cascader"
          :areavalue='area'
          @areaChange='areaChange'
          @setMapCenter='setMapCenter'
        />
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="type">
          <el-radio
            v-for="type in parking_type"
            :label="type.value"
            :key="type.value"
          >{{ type.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="可停放车辆"
        prop='available'
      >
        <el-input
          type='number'
          v-model="available"
        ></el-input>
      </el-form-item>

      <el-form-item label="禁启用">
        <el-radio-group v-model="disabled">
          <el-radio
            v-for="status in parking_status"
            :label="status.value"
            :key="status.value"
          >{{ status.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="位置">
        <div class="address-map">
          <Amap
            ref="amap"
            @gnoteChange='gnoteChange'
          />
        </div>
      </el-form-item>

      <el-form-item
        label="经纬度"
        prop='Gnote'
      >
        <el-input v-model="Gnote"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          :loading='loading'
        >立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useStore } from "vuex";
import Amap from "@/views/amap/index.vue";
import { ElMessage  } from 'element-plus';

import CityArea from '@/components/cascader/cityArea.vue';

import { ParkingAdd } from "@/api/parking.js";

export default {
    name:'ParkingAdd',
    components:{ 
      Amap,
      CityArea,
    },
    setup(){
      const store = useStore();
      const parking_status = store.state.config.parking_status;
      const parking_type = store.state.config.parking_type;
      
      const forms = reactive({
          name: '',
          area: '',
          type: 1,
          available: 0,
          disabled: 1,
          Gnote: '',
      })
      const form = toRefs(forms);

      let amap = ref('');
      let loading = ref(false);

      const parking_form = ref('');
      const parkingadd_cascader = ref('');
      const rules = {
        name:[
          {
            required:true,
            message:'请输入停车场名称',
            trigger:'blur',
          }
        ],
        area:[
          {
            required:true,
            message:'请选择省市区',
            trigger:'change',
          }
        ],
        Gnote:[
          {
            required:true,
            message:'经纬度不能为空',
            trigger:'change',
          }
        ],
      }

      const areaChange = (val)=>{
        form.area.value = val;
      }
      const gnoteChange=(val)=>{
        form.Gnote.value = val;
      }
      const setMapCenter=(address)=>{
        // console.log(amap);
        amap.value.setMapCenter(address)
      }
      function parkingAdd(data){
        // console.log(data);
        loading.value = true;
        ParkingAdd(data).then(response=>{
          ElMessage({
            message: response.message,
            type: "success",
          })
          // console.log(response);
          reset();
        }).catch((err)=>{
          ElMessage({
            message: err.message,
            type: "success",
          })
        }).finally(()=>{
          loading.value = false;
        })
   
      }
      const onSubmit =()=>{
        parking_form.value.validate((valid)=>{
          if(valid){
            const data ={
              parkingName: forms.name,
              area: forms.area,
              type: forms.type,
              carsNumber: forms.available,
              status: forms.disabled ,
              lnglat: forms.Gnote,  
            }
            parkingAdd(data);
          }else{
            ElMessage({
            message: '请检查数据是否缺失或有误',
            type: "error",
          })
          }
        })
      }
      const reset = ()=>{
          parking_form.value.resetFields();
          parkingadd_cascader.value.clearCascader();
      }

      return{
        forms,
        ...form,
        areaChange,
        gnoteChange,
        setMapCenter,
        amap,
        onSubmit,
        parking_form,
        rules,
        parkingadd_cascader,
        loading,
        parking_status,
        parking_type,
      }
    }
}
</script>

<style lang="scss" scoped>
.parking-add {
  .el-form-item {
    display: block;
    text-align: left;
  }
  .address-map {
    width: 100%;
    height: 250px;
    border: 1px solid #ccc;
    .amap-container {
      height: 100%;
    }
  }
}
</style>