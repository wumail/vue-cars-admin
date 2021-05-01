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
          :areavalue='area'
          @areaChange='areaChange'
          @setMapCenter='setMapCenter'
        />
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="type">
          <el-radio :label="1">室内</el-radio>
          <el-radio :label="2">室外</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="可停放车辆">
        <el-input
          type='number'
          v-model="available"
        ></el-input>
      </el-form-item>

      <el-form-item label="禁启用">
        <el-radio-group v-model="disabled">
          <el-radio :label="1">禁用</el-radio>
          <el-radio :label="2">启用</el-radio>
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
        >立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import Amap from "@/views/amap/index.vue";
import CityArea from '@/components/cascader/cityArea.vue';

import { ParkingAdd } from "@/api/parking.js";

export default {
    name:'ParkingAdd',
    components:{ 
      Amap,
      CityArea,
    },
    setup(){
      const forms = reactive({
          name: '',
          area: '',
          type: 1,
          available: 0,
          disabled: 1,
          Gnote: '',
      })

      const parking_form = ref('');
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

      let amap = ref('');

      const form = toRefs(forms);

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
        ParkingAdd(data).then(response=>{
          console.log(response);
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
              lonlan: forms.Gnote,  
            }
            parkingAdd(data);
          }else{
            console.log(`___:${forms}`);
          }
        })
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
      }
    }
}
</script>

<style lang="scss">
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