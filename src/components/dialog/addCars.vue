<template>
  <div class="cars-dialog">
    <el-dialog
      title="新增车辆品牌"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      center
    >
      <el-form
        ref="form"
        label-width="100px"
      >
        <el-form-item label="车辆品牌">
          <el-input v-model="brand"></el-input>
        </el-form-item>

        <el-form-item label="品牌型号">
          <el-input v-model="model"></el-input>
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
          <el-radio-group v-model="disabled">
            <el-radio label="禁用"></el-radio>
            <el-radio label="启用"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            type='textarea'
            v-model="description"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">立即创建</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button
            type="primary"
            @click="close"
          >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { inject, onMounted, reactive, ref, toRef, toRefs } from 'vue';

export default {
    name:'AddCars',
    props:{

    },
    setup(){
        const dialogVisible = inject('dialogVisible');
        const forms = reactive({
          brand: '',
          model: '',
          description: '',
          disabled: '启用',
        })

        const form = toRefs(forms);

        const close = ()=>{
            inject('dialogVisible',false);
        }

        // onMounted(()=>{
        //     console.log(dialogVisible);
        // })
        return{
            ...form,
            close,
            dialogVisible,
        }
    }
    
}
</script>

<style lang="scss">
</style>