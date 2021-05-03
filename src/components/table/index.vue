<template>
  <div>
    <el-table
      border
      style="width: 100%"
      v-loading="loading"
      :data='resource.tableData'
    >
      <el-table-column
        type="selection"
        width="40"
        v-if="tableconfig.checkbox"
      >
      </el-table-column>
      <template v-for="item in tableconfig.thead">
        <!--callback-->
        <el-table-column
          v-if="item.type === 'callback'"
          :key="item.prop"
          :prop='item.prop'
          :label='item.label'
        >
          <template v-slot='scoped'>
            <span v-html="item.callback && item.callback(scoped.row,item.prop)"></span>
          </template>
        </el-table-column>
        <!--slot-->
        <el-table-column
          v-else-if="item.type === 'slot'"
          :key="item.prop"
          :prop='item.prop'
          :label='item.label'
        >
          <template v-slot='scoped'>
            <slot
              :name='item.slot'
              :data='scoped.row'
            ></slot>
          </template>
        </el-table-column>
        <!--normal-->
        <el-table-column
          v-else
          :key="item.prop"
          :prop='item.prop'
          :label='item.label'
        ></el-table-column>
      </template>
    </el-table>
    <div>
      <el-row v-if="resource.flag">
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
</template>

<script>
import { inject, onBeforeMount, provide, reactive, ref, toRefs } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage,ElMessageBox  } from 'element-plus';

import { GetTableData, Delete } from "@/api/common.js";

export default {
    name:'Table',
    props:{
        config:{
            type:Object,
            default:()=>{},
        },
    },
    setup(props,context){
        // const parking_Status = inject('parking_Status');
        // const parking_Type = inject('parking_Type');
        const tableconfig = {
            thead:[],
            checkbox:true,
            url:'',
            pagination:{
            },
        };
        function initTableConifg(){
            for (const key in props.config) {
                if(Object.keys(tableconfig).includes(key)){
                    tableconfig[key] = props.config[key];
                }
            }
        }
        initTableConifg()
        //data resource
        const resource = reactive({
          tableData:[],
          total:0,
          current_page:1,
          ...tableconfig.pagination,
        })

        let filter = {}

        const loading = ref(false);

        function loadTableResource(){
            loading.value = true;
            const params={
                data:{
                    pageSize:resource.pageSize,
                    pageNumber:resource.pageNumber,
                },
                url:tableconfig.url,
            }
            for (const key in filter) {
                let value = filter[key]
                if(value){
                params.data[`${key}`] = value;
                }
            }
            GetTableData(params).then((response)=>{
                const reqdata = response.data;
                if(reqdata){
                    resource.tableData = reqdata.data;
                    resource.total = reqdata.total
                }
            }).finally(()=>{
                loading.value = false;
            })
        }
        onBeforeMount(()=>{
          loadTableResource()
        })

        function filterTableResource(params){
            filter={};
            for (const key in params) {
                let value = eval("params."+key)
                if(value.value){
                    filter[`${key}`] = value.value;
                }
            }
            loadTableResource();
        }

        function handleSizeChange(val){
          resource.pageSize = val;
          loadTableResource();
        }

        function handleCurrentChange(val){
          resource.current_page=val;
          loadTableResource();
        }

        async function tableDelete(id,loading){
         return ElMessageBox.confirm('确定删除此信息','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(()=>{
            let requestData = {
                url: `${tableconfig.url}Delete`,
                data: { id },
            }
            Delete(requestData).then((response)=>{
              ElMessage({
                message: response.message,
                type: "success",
              })
              loadTableResource();
            }).catch((err)=>{
              ElMessage({
                message: err.message,
                type: "error",
              })
            }).finally(()=>{
                loading.value = false;
            })
          })
        }
        return{
            initTableConifg,
            tableconfig,
            loading,
            resource,
            filter,
            handleSizeChange,
            handleCurrentChange,
            tableDelete,
            filterTableResource,
            loadTableResource,
        }
    }

}
</script>

<style lang="scss" scoped>
</style>