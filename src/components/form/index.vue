<template>
  <el-form
    ref="formRef"
    :model='formConfig.forms'
    label-width="100px"
  >
    <el-form-item
      v-for="item in formItem"
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
      <!--radio-->
      <el-radio-group
        v-if="item.type === 'radio'"
        v-model='forms[item.prop]'
      >
        <el-radio
          v-for='radio in item.options'
          :key="radio.value"
          :label='radio.value'
        >{{radio.label}}</el-radio>
      </el-radio-group>
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
          :value='option.id'
          :label='option.value'
        ></el-option>
      </el-select>
      <!--upload-->
      <template v-if="item.type === 'upload'">
        <Upload
          :url='forms[item.prop]'
          :upLoadProp='item.prop'
          @uploadImgUrl='uploadImgUrl'
        />
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import { provide, reactive, ref, toRefs } from 'vue'
import Upload from "../upload/index";

export default {
    name:'Form',
    props:{
        formItem:{
            type:Array,
            default:()=>{}
        },
        formModel:{
            type:Object,
            default:()=>{}
        },
    },
    components:{
        Upload,
    },
    setup(props){
        const formConfig = reactive(
            {
                forms:{
                },
            }
        )
        const formRef = ref('')
        const formConfigs = toRefs(formConfig)
        function initForm(){
            formConfig.forms = props.formModel;
        }

        initForm();

        function resetForm(){
            formRef.value.resetFields();
        }

        async function formValidate(){
            return formRef.value.validate()
        }
        function uploadImgUrl(data) {
          formConfig.forms[data.object] = data.value
        }

        return{
            formConfig,
            ...formConfigs,
            formRef,
            resetForm,
            formValidate,
            uploadImgUrl,
        }
    }
}
</script>

<style lang="scss">
</style>