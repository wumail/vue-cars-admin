<template>
  <div class="brand-list">
    <el-row>
      <el-col :span='18'>
        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
        >
          <el-form-item label="车辆品牌">
            <el-select
              v-model="formInline.type"
              placeholder="类型"
            >
              <el-option
                label="福特"
                value="ford"
              ></el-option>
              <el-option
                label="奔驰"
                value="benz"
              ></el-option>
              <el-option
                label="宝马"
                value="bmw"
              ></el-option>
              <el-option
                label="WEY"
                value="wey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌型号">
            <el-input
              v-model="formInline.park"
              placeholder="品牌型号"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span='6'>
        <el-button
          class="pull-right"
          type='primary'
          @click="dialogVisible = true"
        >新增品牌</el-button>
      </el-col>
    </el-row>
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
          label="LOGO"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="车辆品牌"
        >
        </el-table-column>
        <el-table-column
          prop="area"
          label="品牌型号"
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
    <!-- <el-dialog
      class="cars-add"
      title="新增车辆品牌"
      v-model="dialogVisible"
      center
    >
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
      >
        <el-form-item label="车辆品牌">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="品牌型号">
          <el-cascader
            v-model="value"
            :options="options"
            :props="props"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="LOGO">
          <div class="upload-img-wrap">
            <div class="upload-img"></div>
            <ul class="img-list">
              <li>
                <img
                  src="https://th.bing.com/th/id/R53993535dbcc9828ed9f5866df70d25c?rik=x3iv6r2BYnJ6hQ&riu=http%3a%2f%2fpic27.nipic.com%2f20130320%2f12019865_094551386153_2.jpg&ehk=Sig9vdB5UxRWI5WjFSX%2fKHsPoHR1VICzPI5JDXG%2bjSA%3d&risl=&pid=ImgRaw"
                  alt="benz"
                >
              </li>
              <li>
                <img
                  src="https://th.bing.com/th/id/R53993535dbcc9828ed9f5866df70d25c?rik=x3iv6r2BYnJ6hQ&riu=http%3a%2f%2fpic27.nipic.com%2f20130320%2f12019865_094551386153_2.jpg&ehk=Sig9vdB5UxRWI5WjFSX%2fKHsPoHR1VICzPI5JDXG%2bjSA%3d&risl=&pid=ImgRaw"
                  alt="benz"
                >
              </li>
              <li>
                <img
                  src="https://th.bing.com/th/id/R53993535dbcc9828ed9f5866df70d25c?rik=x3iv6r2BYnJ6hQ&riu=http%3a%2f%2fpic27.nipic.com%2f20130320%2f12019865_094551386153_2.jpg&ehk=Sig9vdB5UxRWI5WjFSX%2fKHsPoHR1VICzPI5JDXG%2bjSA%3d&risl=&pid=ImgRaw"
                  alt="benz"
                >
              </li>

            </ul>
          </div>
        </el-form-item>

        <el-form-item label="禁启用">
          <el-radio-group v-model="form.resource">
            <el-radio label="禁用"></el-radio>
            <el-radio label="启用"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            type='textarea'
            v-model="form.name"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >立即创建</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogVisible = false"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog> -->
    <CarsDialog />
  </div>

</template>

<script>
import CarsDialog from "@/components/dialog/addCars.vue";
import {  provide, reactive, ref } from 'vue';
export default {
    name:'BrandList',
    components:{
      CarsDialog,
    },
    setup(){
        const formInline = reactive( {
          park: '',
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
                    name:'logo1',
                    type:'宝马',
                    area:'宝马M4',
                    disabled:true,
                },
                {
                    name:'logo2',
                    type:'奔驰',
                    area:'奔驰g500',
                    disabled:false,
                },
            ]
        )
        
        const form = reactive({
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
      })

        const dialogVisible=ref(false);

        provide('dialogVisible',dialogVisible);
        // const ifVisble=(val)=>{
        //   dialogVisible.value = val;
        // }

        return{
            formInline,
            props,
            value,
            options,
            tableData,
            dialogVisible,
            // ifVisble,
            form,
        }
    }
}
</script>

<style lang="scss" scoped>
.brand-list {
  display: block;
  text-align: left;
}

</style>