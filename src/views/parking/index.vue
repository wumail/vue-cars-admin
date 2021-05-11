<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span='22'>
          <el-form
            :inline="true"
            :model="filter"
            ref='filterRef'
            class="demo-form-inline"
          >
            <el-form-item
              label="停车场"
              prop='parkingName'
            >
              <el-input
                v-model="filter.parkingName"
                placeholder="停车场"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="区域"
              prop='area'
            >
              <CityArea
                ref="parkingadd_cascader"
                :areavalue='filter.area'
                @areaChange='areaChange'
              />
            </el-form-item>
            <el-form-item
              label="类型"
              prop='type'
            >
              <el-select
                v-model="filter.type"
                placeholder="类型"
                class="width-100"
              >
                <el-option
                  v-for="type in parking_type"
                  :key="type.value"
                  :value="type.value"
                  :label="type.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="禁启用"
              prop='status'
            >
              <el-select
                v-model="filter.status"
                placeholder="禁启用"
                class="width-100"
              >
                <el-option
                  v-for="status in parking_status"
                  :key="status.value"
                  :value="status.value"
                  :label="status.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click='search'
              >查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="info"
                @click='reset'
                plain
              >重置查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span='2'>
          <router-link to="ParkingAdd">
            <el-button
              class="pull-right"
              type='primary'
            >新增停车场</el-button>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <div class="table-form">
      <TableCmp
        :config='tableConfig'
        ref="tableRef"
      >
        <template #table_status='slotdata'>
          <el-switch
            :loading='switchLoading'
            @change="changeStatus(slotdata.data)"
            v-model="slotdata.data.status"
            :active-value='true'
            :inactive-value='false'
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>

        <template #table_lnglat='slotdata'>
          <el-button
            v-model="slotdata.data.lnglat"
            size="small"
            plain
            @click='amapDialog(slotdata.data)'
          >查看地图</el-button>
        </template>

        <template #table_option='slotdata'>
          <el-button
            type="primary"
            size="small"
            plain
            @click="rowEdit(slotdata.data.id)"
          >编辑</el-button>
          <el-button
            :loading='deleteLoading'
            type="danger"
            size="small"
            plain
            @click="rowDelete(slotdata.data.id)"
          >删除</el-button>
        </template>
      </TableCmp>
    </div>
    <AmapDialog ref='amapRef' />
  </div>
</template>

<script>
import { provide, reactive, ref, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage,ElMessageBox  } from 'element-plus';

import { ParkingStatus } from "@/api/parking.js";
import { Delete } from "@/api/common.js";
import CityArea from '@/components/cascader/cityArea.vue';
import AmapDialog from "@/components/dialog/amapDialog.vue";
import TableCmp from "@/components/table/index.vue";


export default {
    name:'Parking',
    components:{
      CityArea,
      AmapDialog,
      TableCmp,
    },
    setup(){
        //store
        const store = useStore();
        const parking_status = store.state.config.parking_status;
        const parking_type = store.state.config.parking_type;
        provide('parking_Status',parking_status)
        provide('parking_Type',parking_type)
        //router
        const router = useRouter();
        //子组件Ref
        const filterRef = ref('');
        const parkingadd_cascader = ref('');
        const amapRef = ref('');
        const tableRef = ref('');
        //ref
        const switchLoading = ref(false);
        const deleteLoading = ref(false);
        //filter
        const filter = reactive( {
          parkingName: '',
          area: '',
          type:'',
          status:'',
        })
        const filters = toRefs(filter);
        //cascader
        const props = reactive({ expandTrigger: 'hover' })
        const value = reactive([])
        //table
        const tableConfig ={
          thead:[
            {
              label:'停车场名称',prop:'parkingName'
            },
            {
              label:'类型',prop:'type',
              type:'callback',
              callback:(row,prop)=>{
                const data = parking_type.filter(item => item.value == row[prop]);
                if(data && data.length > 0){
                  return data[0].label;
                }
              }
            },
            {
              label:'区域',prop:'address',
              type:'callback',
              callback:(row,prop)=>{
                return row[prop]?row[prop].split(',').join('<br/>'):'';
              }
            },
            {
              label:'可停放车辆',prop:'carsNumber'
            },
            {
              label:'禁启用',prop:'status',
              type:'slot',
              slot:'table_status',
            },
            {
              label:'查看位置',prop:'lnglat',
              type:'slot',
              slot:'table_lnglat',
            },
            {
              label:'操作',
              type:'slot',
              slot:'table_option',
            },
          ],
          checkbox:true,
          url:'parkingList',
          pagination:{
                flag:true,
                pageSize:10,
                pageNumber:1,
          },
        };
        //provider
        const dialogVisible = ref(false);
        provide('dialogVisible',dialogVisible);
        provide('lnglat',dialogVisible);

        // onBeforeMount(()=>{
        //   getDataResource()
        // })

        const areaChange = (val)=>{
          filter.area = val;
        }

        function search(){
          tableRef.value.filterTableResource(filters);
        }

        function reset(){
          filterRef.value.resetFields();
          parkingadd_cascader.value.clearCascader();
          tableRef.value.filterTableResource(filters);
        }

        function amapDialog(row){
          dialogVisible.value=true;
          amapRef.value.setLnglat(row.lnglat);
          amapRef.value.setTitle(row);
        }

        function rowEdit(id){
          router.push({
            name:'ParkingAdd',
            query:{
              id
            }
          })
        }
        function rowDelete(id){
          deleteLoading.value = true;
          tableRef.value.tableDelete(id,deleteLoading).catch(()=>{
            deleteLoading.value = false;
          })
        }

        function changeStatus(data){
          switchLoading.value= true;
          const request = {
            id:data.id,
            status:data.status
          }
          ParkingStatus(request).then((response)=>{
            ElMessage({
                message: response.message,
                type: "success",
              })
          }).catch((err)=>{
              ElMessage({
                message: err.message,
                type: "error",
              })
          }).finally(()=>{
            switchLoading.value= false;
          })
        }
        return{
            filter,
            filterRef,
            parkingadd_cascader,
            props,
            value,
            areaChange,
            parking_status,
            parking_type,
            search,
            reset,
            amapDialog,
            amapRef,
            tableRef,
            rowEdit,
            rowDelete,
            tableConfig,
            changeStatus,
            switchLoading,
            deleteLoading,
        }
    }
}
</script>
<style lang="scss" >
.filter-form {
  display: block;
  text-align: left;
}
</style>