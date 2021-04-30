<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span='20'>
          <el-form
            :inline="true"
            :model="formInline"
            
            class="demo-form-inline"
          >
            <el-form-item label="停车场">
              <el-input
                v-model="formInline.park"
                placeholder="停车场"
              ></el-input>
            </el-form-item>
            <el-form-item label="区域">
              <el-cascader
                v-model="value"
                :options="options"
                :props="props"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="类型">
              <el-select
                v-model="formInline.type"
                placeholder="类型"
              >
                <el-option
                  label="室内"
                  value="shanghai"
                ></el-option>
                <el-option
                  label="室外"
                  value="beijing"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="danger">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span='4'>
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
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="40"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="停车场名称"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
        >
        </el-table-column>
        <el-table-column
          prop="area"
          label="区域"
        >
        </el-table-column>
        <el-table-column
          prop="carsNumber"
          label="可停放车辆"
        >
        </el-table-column>
        <el-table-column
          prop="disabled"
          label="禁启用"
        >
          <template #disabled>
            <el-switch
              :model='disabled'
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="查看位置"
        >
        </el-table-column>
        <el-table-column label="操作">
          <el-button
            type="primary"
            size="small"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
          >删除</el-button>

        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import { onMounted, reactive } from 'vue';
export default {
    name:'Parking',
    setup(){
        const formInline = reactive( {
          park: '',
          region: '',
          type:'',
        })
        
        const props = reactive({ expandTrigger: 'hover' })
        const value = reactive([])
        const options = reactive([
            {
                value:11,
                label:'四川省',
                children:[
                    {
                        value:11,
                        label:'绵阳市',
                    },  
                ]
            }
        ])

        const tableData = reactive(
            [
                {
                    name:'太白停车场',
                    type:'室外',
                    area:'四川省绵阳市',
                    carsNumber:20,
                    disabled:true,
                    address:'4512,2314',
                },
                {
                    name:'南岗停车场',
                    type:'室外',
                    area:'黑龙江省哈尔滨市',
                    carsNumber:10,
                    disabled:false,
                    address:'4512,2314',
                },
            ]
        )

        return{
            formInline,
            props,
            value,
            options,
            tableData,
        }
    }
}
</script>
<style lang="scss" scoped>
.filter-form {
  display: block;
  text-align: left;
}
</style>