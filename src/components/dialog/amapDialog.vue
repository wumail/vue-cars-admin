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
      <h4 class="address-content">{{content}}</h4>
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
        const content = ref('');
        const dialogVisible = inject('dialogVisible');
        const close = ()=>{
            inject('dialogVisible',false);
        }
        const onclosed = ()=>{
            amap.value.mapDestroy();
        }
        const disabled = ref(true);

        function setLnglat(val){
            const [lng,lat] = val.split(',');
            lnglat.value = [+lng,+lat];
        }
        function setTitle(val){
            title.value =`  ${val.parkingName}  的详细位置`;
            content.value = `${val.address}`;
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
            content,
            setTitle,
        }
    }
}
</script>

<style lang="scss" >
.cars-dialog {
  .address-content {
    text-align: center;
    margin-bottom: 10px;
    opacity: 0.8;
  }
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