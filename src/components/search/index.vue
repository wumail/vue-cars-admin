<template>
  <el-row>
    <el-col
      v-for="col in searchItem"
      :key="col.id"
      :span='col.span'
    >
      <el-form
        :inline="true"
        ref="searchRef"
        :model='forms'
        class="demo-form-inline"
      >
        <el-form-item
          v-for="item in col.colItem"
          :key="item.prop"
          :label='item.label'
          :prop='item.prop'
          :label-width='item.label_width'
          :rules='item.rules'
        >
          <!--input-->
          <el-input
            v-if="item.type === 'input'"
            :placeholder='item.placeholder'
            :style="{width:item.width}"
            v-model='forms[item.prop]'
            :type="item.input_type?item.input_type:''"
            :disabled='item.disabled'
          >
          </el-input>
          <!--slot-->
          <slot
            v-if="item.type === 'slot'"
            :name='item.slot'
          ></slot>
          <!--select-->
          <el-select
            v-if="item.type === 'select'"
            :placeholder='item.placeholder'
            :style="{width:item.width}"
            v-model='forms[item.prop]'
            :filterable='item.filterable'
          >
            <el-option
              v-for="option in item.options"
              :key="option.id"
              :value='option.value'
              :label='option.label'
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { onBeforeMount, reactive, ref, toRefs } from 'vue'
export default {
    name:'Search',
    props:{
        searchItem:{
            type:Object,
            default:()=>{}
        },
        searchModel:{
            type:Object,
            default:()=>{}
        },
    },
    components:{
        
    },
    setup(props){
        const searchConfig = reactive(
            {
                forms:{
                },
            }
        )
        const searchRef = ref('')
        const searchConfigs = toRefs(searchConfig)
        function initForm(){
            searchConfig.forms = props.searchModel;
        }

        initForm();

        function resetForm(){
            for (const key in  searchConfig.forms) {
                searchConfig.forms[key] = ''
            }
            // searchRef.value.resetFields();
        }

        return{
            searchConfig,
            ...searchConfigs,
            searchRef,
            resetForm,
        }
    }
}
</script>

<style lang="scss">
</style>