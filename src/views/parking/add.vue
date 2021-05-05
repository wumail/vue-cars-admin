<template>
  <div class="parking-add">
    <FormCmp
      :formItem='formItems'
      :formModel='forms'
      :rules='rules'
      ref="formCmpRef"
      label-width="100px"
    >
      <template #CityArea>
        <CityArea
          ref="parkingadd_cascader"
          :areavalue='area'
          @areaChange='areaChange'
          @setMapCenter='setMapCenter'
        />
      </template>
      <template #Amap>
        <div class="address-map">
          <Amap
            ref="amap"
            @gnoteChange='gnoteChange'
          />
        </div>
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
import { onBeforeMount, onBeforeUnmount, reactive, ref, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRoute,useRouter } from "vue-router";

import Amap from "@/views/amap/index.vue";
import { ElMessage  } from 'element-plus';

import CityArea from '@/components/cascader/cityArea.vue';
import FormCmp from "@/components/form/index.vue";


import { ParkingAdd,ParkingDetailed,ParkingEdit } from "@/api/parking.js";

export default {
    name:'ParkingAdd',
    components:{ 
      Amap,
      CityArea,
      FormCmp,
    },
    setup(){
      const store = useStore();
      const parking_status = store.state.config.parking_status;
      const parking_type = store.state.config.parking_type;

      const route = useRoute();
      const router = useRouter();
      const id = ref('');
      id.value = route.query?.id;

      let amap = ref('');
      let loading = ref(false);
    
      const formCmpRef = ref('');
      const parkingadd_cascader = ref('');

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
    
      const formItems =reactive(
        [
          {
            type:'input',label:'停车场名称',placeholder:'请输入停车场名称',
            prop:'parkingName'
          },
          {
            type:'slot',slot:'CityArea',label:'区域',
            prop:'area'
          },
          {
            type:'input',label:'详细地址',placeholder:'请输入详细地址',
            prop:'address'
          },
          {
            type:'radio',label:'类型',
            prop:'type',options:parking_type,
          },
          {
            type:'input',input_type:'number',label:'可停放车辆',placeholder:'可停放车辆数量',
            prop:'carsNumber'
          },
          {
            type:'radio',label:'禁启用',
            prop:'status',options:parking_status,
          },
          {
            type:'slot',slot:'Amap',label:'位置',
          },
          {
            type:'input',label:'经纬度',
            prop:'lnglat',disabled:true,
          },
          {
            type:'slot',slot:'Button'
          },
        ]
      )

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
        formCmpRef.value.formValidate().then(()=>{
            const data ={
              parkingName: forms.parkingName,
              area: forms.area,
              type: forms.type,
              carsNumber: forms.carsNumber,
              status: forms.status ,
              lnglat: forms.lnglat, 
              address: forms.address, 
            }
            // console.log(data);
            button.Flag === 'add'? parkingAdd(data): parkingEdit(data);
        }).catch(()=>{
          ElMessage({
            message: '请检查数据是否缺失或有误',
            type: "error",
          })
        })
      }

      const reset = ()=>{
          formCmpRef.value.resetForm();
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
        formItems,
        areaChange,
        gnoteChange,
        setMapCenter,
        amap,
        onSubmit,
        rules,
        parkingadd_cascader,
        loading,
        parking_status,
        parking_type,
        button,
        formCmpRef,
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