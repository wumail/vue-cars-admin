<template>
  <div class="parking-add">
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
    >
      <el-form-item label="停车场名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="区域">
        <el-cascader
          v-model="value"
          :options="options"
          :props="props"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="form.resource">
          <el-radio label="室内"></el-radio>
          <el-radio label="室外"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="可停放车辆">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="禁启用">
        <el-radio-group v-model="form.resource">
          <el-radio label="禁用"></el-radio>
          <el-radio label="启用"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="位置">
        <div class="address-map"></div>
      </el-form-item>

      <el-form-item label="经纬度">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
        >立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
    name:'ParkingAdd',
    setup(){
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
      return{
        form,
      }
    }
}
</script>

<style lang="scss">
.parking-add {
  .el-form-item {
    display: block;
    text-align: left;
  }
  .address-map {
    width: 100%;
    height: 250px;
    border: 1px solid #ccc;
  }
}
</style>