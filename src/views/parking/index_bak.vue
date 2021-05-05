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
      <el-table
        :data="resource.tableData"
        v-loading="loading"
        border
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="40"
        >
        </el-table-column>

        <el-table-column
          prop="parkingName"
          label="停车场名称"
        >
        </el-table-column>

        <el-table-column
          prop="type"
          label="类型"
        >
          <template v-slot='scoped'>
            {{scoped.row.type==='1'?'室内':'室外'}}
          </template>
        </el-table-column>

        <el-table-column
          prop="address"
          label="区域"
        >
        </el-table-column>

        <el-table-column
          prop="carsNumber"
          label="可停放车辆"
        >
        </el-table-column>

        <el-table-column
          prop="status"
          label="禁启用"
        >
          <template v-slot='scoped'>
            <el-switch
              v-model="scoped.row.status"
              :active-value='false'
              :inactive-value='true'
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>

        </el-table-column>

        <el-table-column
          prop="lnglat"
          label="查看位置"
        >
          <template v-slot='scoped'>
            <el-button
              v-model="scoped.row.lnglat"
              size="small"
              plain
              @click='amapDialog(scoped.row)'
            >查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template v-slot='scoped'>
            <el-button
              type="primary"
              size="small"
              plain
              @click="rowEdit(scoped.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              plain
              @click="rowDelete(scoped.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div>
        <el-row>
          <el-col :span="12"></el-col>
          <el-col
            :span="12"
            style="margin-top:10px"
          >
            <span class="demonstration"></span>
            <el-pagination
              class="pull-right"
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="resource.current_page"
              :page-sizes="[10, 20, 50]"
              :page-size="10"
              layout="total, sizes, prev, pager, next, jumper"
              :total="resource.total"
            >
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>
    <AmapDialog ref='amapRef' />
  </div>
</template>

<script>
import { onBeforeMount, provide, reactive, ref, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage,ElMessageBox  } from 'element-plus';

import { ParkingList,ParkingDelete } from "@/api/parking.js";
import CityArea from '@/components/cascader/cityArea.vue';
import AmapDialog from "@/components/dialog/amapDialog.vue";

export default {
    name:'Parking',
    components:{
      CityArea,
      AmapDialog,
    },
    setup(){
        //store
        const store = useStore();
        const parking_status = store.state.config.parking_status;
        const parking_type = store.state.config.parking_type;
        //router
        const router = useRouter();
        //子组件Ref
        const filterRef = ref('');
        const parkingadd_cascader = ref('');
        const amapRef = ref('');
        //ref
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

        //data resource
        const resource = reactive({
          tableData:[],
          total:0,
          current_page:1,
          pageSize:10,
          pageNumber:1,
        })

        const loading = ref(false);

        //provider
        const dialogVisible = ref(false);
        provide('dialogVisible',dialogVisible);
        provide('lnglat',dialogVisible);

        onBeforeMount(()=>{
          getDataResource()
        })

        const getDataResource = ()=>{
          loading.value = true;
          const data={
            pageSize:resource.pageSize,
            pageNumber:resource.pageNumber,
          }
          for (const key in filters) {
            let value = eval("filters."+key)
            if(value.value){
              data[`${key}`] = value.value;
            }
          }
          ParkingList(data).then((response)=>{
            const reqdata = response.data;
              console.log(reqdata);
            if(reqdata){
              resource.tableData = reqdata.data;
              resource.total = reqdata.total
            }
          }).finally(()=>{
            loading.value = false;
          })
        }

        const areaChange = (val)=>{
          filter.area = val;
        }

        function handleSizeChange(val){
          resource.pageSize = val;
          getDataResource();
        }

        function handleCurrentChange(val){
          resource.current_page=val;
          getDataResource();
        }

        function search(){
          getDataResource();
        }

        function reset(){
          filterRef.value.resetFields();
          parkingadd_cascader.value.clearCascader();
          getDataResource();
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
          ElMessageBox.confirm('确定删除此信息','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(()=>{
            ParkingDelete({id}).then((response)=>{
              ElMessage({
                message: response.message,
                type: "success",
              })
              getDataResource();
            }).catch((err)=>{
              ElMessage({
                message: err.message,
                type: "error",
              })
            })
          })
          
        }
        return{
            filter,
            filterRef,
            parkingadd_cascader,
            props,
            value,
            resource,
            handleSizeChange,
            handleCurrentChange,
            areaChange,
            parking_status,
            parking_type,
            search,
            reset,
            amapDialog,
            amapRef,
            rowEdit,
            rowDelete,
            loading,
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