<template>
  <div>
    <div class="filter-form">
      <Search
        ref="SearchRef"
        :searchItem='searchItem'
        :searchModel='searchModel'
      >
        <template #buttonSearch>
          <el-button
            type="primary"
            @click='search'
          >查询</el-button>
        </template>
        <template #buttonReset>
          <el-button
            plain
            type="info"
            @click="reset"
          >重置查询</el-button>
        </template>
        <template #buttonCreate>
          <router-link to="CarsAdd">
            <el-button
              class="pull-right"
              type='primary'
            >新增停车场</el-button>
          </router-link>
        </template>
      </Search>
      <!-- <el-row>
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
          <router-link to="CarsAdd">
            <el-button
              class="pull-right"
              type='primary'
            >新增停车场</el-button>
          </router-link>
        </el-col>
      </el-row> -->
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
  </div>
</template>

<script>
import { provide, reactive, ref, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage,ElMessageBox  } from 'element-plus';

import { CarsStatus } from "@/api/car.js";
import { Delete } from "@/api/common.js";
import CityArea from '@/components/cascader/cityArea.vue';
import TableCmp from "@/components/table/index.vue";
import Search from "@/components/search/index.vue";


export default {
    name:'Parking',
    components:{
      CityArea,
      TableCmp,
      Search,
    },
    setup(){
        //store
        const store = useStore();
        const parking_status = store.state.config.radio_disabled;
        const parking_type = store.state.config.parking_type;
        const year_check = store.state.config.year_check_1;
        const gear = store.state.config.gear;
        const energyType = store.state.config.energyType_1;
        //router
        const router = useRouter();
        //子组件Ref
        const filterRef = ref('');
        const parkingadd_cascader = ref('');
        const tableRef = ref('');
        //ref
        const switchLoading = ref(false);
        const deleteLoading = ref(false);
        //cascader
        const props = reactive({ expandTrigger: 'hover' })
        const value = reactive([])
        //table
        const tableConfig ={
          thead:[
            {
              label:'车牌号',prop:'carsMode',
              columnWidth:'100'
            },
            {
              label:'车辆品牌',prop:'nameCh',
              columnWidth:'100'
            },
            {
              label:'LOGO',prop:'imgUrl',
              type:'image',columnWidth:'99',
              imgWidth:72,
            },
            {
              label:'预览图',prop:'carsImg',
              type:'image',columnWidth:'99',
              imgWidth:72,
            },
            {
              label:'年检',prop:'yearCheck',
              type:'callback',columnWidth:'100',
              callback:(row,prop)=>{
                const data = year_check.filter(item => item.value == row[prop]);
                if(data && data.length > 0){
                  return data[0].label;
                }
              }
            },
            {
              label:'能源类型',prop:'energyType',
              type:'callback',columnWidth:'100',
              callback:(row,prop)=>{
                const data = energyType.filter(item => item.value == row[prop]);
                if(data && data.length > 0){
                  return data[0].label;
                }
              }
            },
            {
              label:'禁启用',prop:'status',
                type:'slot',columnWidth:'81',
                slot:'table_status',
            },
            {
              label:'停车场',prop:'parkingName'
            },
            {
              label:'区域',prop:'address',
              type:'callback',
              callback:(row,prop)=>{
                return row[prop]?row[prop].split(',').join('<br/>'):'';
              }
            },
            {
              label:'发动机号',prop:'carsNumber'
            },
            {
              label:'车架号',prop:'carsNumber'
            },
            {
              label:'操作',
              type:'slot',
              slot:'table_option',
            },
          ],
          checkbox:true,
          url:'carsList',
          pagination:{
            flag:true,
                pageSize:10,
                pageNumber:1,
          },
        };
        //search
        const searchItem =reactive(
          {
            col1:{
              span:17,
              colItem:[
                {
                  type:'input',label:'车辆品牌',placeholder:'车辆品牌',
                  prop:'nameCh',width:'200px'
                },
                {
                  type:'input',label:'停车场',placeholder:'停车场',
                  prop:'parkingName',width:'200px'
                },
                {
                  type:'input',label:'区域',placeholder:'区域',
                  prop:'address',
                },
                {
                  type:'select',label:'年检',
                  prop:'yearCheck',width:'100px',
                  options:year_check
                },
                {
                  type:'select',label:'能源类型',
                  prop:'energyType',width:'100px',
                  options:energyType
                },
                {
                  type:'select',label:'禁启用',
                  prop:'status',width:'100px',
                  options:parking_status
                },
              ]
            },
            col2:{
              span:4,
              colItem:[
                {
                  type:'slot',slot:'buttonSearch'
                },
                {
                  type:'slot',slot:'buttonReset'
                },
              ]
            },
            col3:{
              span:3,
              colItem:[
                {
                  type:'slot',slot:'buttonCreate'
                },
              ]
            }
          }
        )
        
        //filter
        const searchModel = reactive(
          {
            parkingName:'',
            nameCh:'',
            address:'',
            yearCheck:'',
            energyType:'',
            status:'',
          }
        )
        const filters = toRefs(searchModel);
        const SearchRef = ref('');
        //provider

        // onBeforeMount(()=>{
        //   getDataResource()
        // })

        function search(){
          console.log(searchModel);
          tableRef.value.filterTableResource(filters);
        }

        function reset(){
          SearchRef.value.resetForm();
          // parkingadd_cascader.value.clearCascader();
          tableRef.value.filterTableResource(filters);
        }

        function rowEdit(id){
          router.push({
            name:'CarsAdd',
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
          CarsStatus(request).then((response)=>{
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
            filterRef,
            parkingadd_cascader,
            props,
            value,
            parking_status,
            parking_type,
            search,
            reset,
            tableRef,
            rowEdit,
            rowDelete,
            tableConfig,
            changeStatus,
            switchLoading,
            deleteLoading,
            searchItem,
            SearchRef,
            searchModel,
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