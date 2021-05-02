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
        prop='parkingName'
      >
        <el-input v-model="parkingName"></el-input>
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

      <el-form-item
        label="详细地址"
        prop='address'
      >
        <el-input v-model="address"></el-input>
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
        prop='carsNumber'
      >
        <el-input
          v-model="carsNumber"
          type='number'
        ></el-input>
      </el-form-item>

      <el-form-item label="禁启用">
        <el-radio-group v-model="status">
          <el-radio
            v-for="state in parking_status"
            :label="state.value"
            :key="state.value"
          >{{ state.label }}</el-radio>
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
        prop='lnglat'
      >
        <el-input v-model="lnglat"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          :loading='loading'
        >{{button.Content}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { onBeforeMount, onBeforeUnmount, reactive, ref, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRoute,useRouter } from "vue-router";

import Amap from "@/views/amap/index.vue";
import { ElMessage  } from 'element-plus';

import CityArea from '@/components/cascader/cityArea.vue';

import { ParkingAdd,ParkingDetailed,ParkingEdit } from "@/api/parking.js";

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

      const route = useRoute();
      const router = useRouter();

      const location = ref('');
      const id = ref('');
      id.value = route.query?.id;
      
      const button = reactive({
        Content:'立即创建',
        Flag:'add',
      })
      const forms = reactive({
          parkingName: '',
          area: '',
          type: 1,
          carsNumber: 0,
          status: 1,
          lnglat: '',
          address:'',
      })
      const form = toRefs(forms);

      let amap = ref('');
      let loading = ref(false);

      const parking_form = ref('');
      const parkingadd_cascader = ref('');
      const rules = {
        parkingName:[
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
        address:[
          {
            required:true,
            message:'请输入详细地址',
            trigger:'blur',
          }
        ],
        lnglat:[
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
        form.lnglat.value = val;
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
            type: "error",
          })
        }).finally(()=>{
          loading.value = false;
        })
      }
      function parkingEdit(data){
        // console.log(data);
        loading.value = true;
        data.id = id.value;
        ParkingEdit(data).then(response=>{
          ElMessage({
            message: response.message,
            type: "success",
          })
          // console.log(response);
          reset();
          router.push({
            name:'ParkingList'
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
      const onSubmit =()=>{
        parking_form.value.validate((valid)=>{
          if(valid){
            const data ={
              parkingName: forms.parkingName,
              area: forms.area,
              type: forms.type,
              carsNumber: forms.carsNumber,
              status: forms.status ,
              lnglat: forms.lnglat, 
              address: forms.address, 
            }
            console.log(data);
            button.Flag === 'add'? parkingAdd(data): parkingEdit(data);
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

      function getDetaile(){
        ParkingDetailed({id:id.value}).then((response)=>{
          const data = response.data;
          button.Content = '立即修改';
          button.Flag = 'edit';
          forms.parkingName = data.parkingName;
          forms.area =data.area;
          forms.type = data.type;
          forms.carsNumber = data.carsNumber;
          forms.status = data.status?1:2;
          forms.lnglat = data.lnglat;
          forms.address = data.address;
          const [lng,lat] = data.lnglat.split(',');
          amap.value.setLnglat(+lng,+lat)
          parkingadd_cascader.value.setPlaceholder(data.region.replaceAll(/\,/g,' / '));
        }).catch((err)=>{
           ElMessage({
            message: err.message,
            type: "error",
          })
        })
      }

      onBeforeMount(()=>{
        if(id.value){
          getDetaile();
        }
      })

      onBeforeUnmount(()=>{
          amap.value.mapDestroy();
      })

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
        location,
        button,
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