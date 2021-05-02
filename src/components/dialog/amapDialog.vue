<template>
  <div class="cars-dialog">
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      width='70%'
      @close='onclosed'
      destroy-on-close
      center
    >
      <div class="address-map">
        <Amap
          :lnglat='lnglat'
          :disabled='disabled'
          ref="amap"
        />
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { inject, ref,} from 'vue';
import Amap from "@/views/amap/index.vue";


export default {
    name:'AddCars',
    components:{Amap},
    props:{
    },
    setup(props){
        const lnglat = ref('');
        const amap = ref('');
        const title = ref('');
        const dialogVisible = inject('dialogVisible');
        const close = ()=>{
            inject('dialogVisible',false);
        }
        const onclosed = ()=>{
            amap.value.mapDestory();
        }
        const disabled = ref(true);
        function setLnglat(val){
            const [lng,lat] = val.split(',');
            lnglat.value = [+lng,+lat];
        }
        function setTitle(val){
            title.value =`${val}的详细位置`;
        }
        return{
            props,
            close,
            disabled,
            dialogVisible,
            amap,
            lnglat,
            setLnglat,
            onclosed,
            title,
            setTitle,
        }
    }
}
</script>

<style lang="scss" scoped>
.cars-dialog {
  .address-map {
    width: 100%;
    height: 400px;
    border: 1px solid #ccc;
    .amap-container {
      height: 100%;
    }
  }
}
</style>