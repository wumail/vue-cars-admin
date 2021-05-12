<template>
  <div class="brand-list">
    <Search
      ref="SearchRef"
      :searchItem='searchItem'
      :searchModel='searchModel'
    >
      <template #buttonSearch>
        <el-button
          type="danger"
          @click="search"
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
        <el-button
          class="pull-right"
          type='primary'
          @click="openDialog"
        >新增品牌</el-button>
      </template>

    </Search>
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
        <template #table_option='slotdata'>
          <el-button
            type="primary"
            size="small"
            plain
            @click="rowEdit(slotdata.data)"
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
    <CarsDialog
      ref='dialogRef'
      :brand_info='brandAbout.brandInfo'
      @brandCallback='brandCallback'
      @brandInfoClear='brandInfoClear'
    />
  </div>

</template>

<script>
import {  nextTick, provide, reactive, ref, toRefs } from 'vue';
import { ElMessage  } from 'element-plus';

import { BrandStatus } from "@/api/brand.js";
import TableCmp from "@/components/table/index.vue";
import CarsDialog from "@/components/dialog/addCars.vue";
import Search from "@/components/search/index.vue";

export default {
    name:'BrandList',
    components:{
      TableCmp,
      CarsDialog,
      Search,
    },
    setup(){
        const tableConfig ={
          thead:[
            {
              label:'LOGO',prop:'imgUrl',
              type:'image',
              imgWidth:72,
            },
            {
              label:'品牌中文',prop:'nameCh'
            },
            {
              label:'品牌英文',prop:'nameEn'
            },
            {
              label:'禁启用',prop:'status',
              type:'slot',
              slot:'table_status',
            },
            {
              label:'操作',
              type:'slot',
              slot:'table_option',
            },
          ],
          url:'brandList',
          pagination:{
                flag:true,
                pageSize:10,
                pageNumber:1,
          },
        }
        
        const searchItem =reactive(
          {
            col1:{
              span:22,
              colItem:[
                {
                  type:'input',label:'车辆品牌',placeholder:'车辆品牌',
                  prop:'brand',
                },
                {
                  type:'slot',slot:'buttonSearch'
                },
                {
                  type:'slot',slot:'buttonReset'
                },
              ]
            },
            col2:{
              span:2,
              colItem:[
                {
                  type:'slot',slot:'buttonCreate'
                },
              ]
            }
          }
        )

        const searchModel = reactive(
          {
            brand:'',
          }
        )
        const SearchRef = ref('');

        const filter = reactive( {
              brand:'',
        })

        const filters = toRefs(searchModel);

        const props = reactive({ expandTrigger: 'hover' })
        const value = reactive([])
   
        const tableRef = ref('');
        const dialogRef = ref('');
        const dialogVisible = ref(false);
        const switchLoading = ref(false);
        const deleteLoading = ref(false);
        const brandAbout =reactive({
          brandID:'',
          brandInfo:{},
        })
        provide('dialogVisible',dialogVisible);
        // const ifVisble=(val)=>{
        //   dialogVisible.value = val;
        // }

        function changeStatus(data){
          switchLoading.value= true;
          const request = {
            id:data.id,
            status:data.status
          }
          BrandStatus(request).then((response)=>{
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

        function openDialog(){
          dialogVisible.value = true;
        }

        function rowEdit(data){
          console.log(data);
          dialogVisible.value = true;
          brandAbout.brandInfo = data;
        }

        function rowDelete(id){
          deleteLoading.value = true;
          tableRef.value.tableDelete(id,deleteLoading).catch(()=>{
            deleteLoading.value = false;
          })
        }

        function search(){
          tableRef.value.filterTableResource(filters);
        }

        function reset(){
          SearchRef.value.resetForm();
          tableRef.value.filterTableResource(filters);
          
        }

        function brandCallback(params){
          if(params.function) {
            dialogVisible.value = false;
            eval(`${params.function}()`)
          }
        }

        function brandInfoClear(clearObj){
          brandAbout.brandInfo = clearObj;
        }

        return{
            tableConfig,
            props,
            value,
            dialogVisible,
            deleteLoading,
            switchLoading,
            filter,
            rowEdit,
            rowDelete,
            tableRef,
            dialogRef,
            changeStatus,
            brandAbout,
            search,
            reset,
            brandCallback,
            brandInfoClear,
            openDialog,
            searchItem,
            SearchRef,
            searchModel,
        }
    }
}
</script>

<style lang="scss">
.brand-list {
  display: block;
  text-align: left;
}
</style>