<template>
  <div id="amap-wrap">

  </div>
</template>
<script>
// import AMap from 'AMap';
import {onMounted} from 'vue';
import { getLngLat,addressSetMapCenter } from "./common";
import AMapLoader from '@amap/amap-jsapi-loader';
// let amapManager = AMapManager;
export default {
    name: 'AMap',
    emits:['gnoteChange'],
    setup(props,{emit}){
      var map=null;
      var marker = null;
      AMapLoader.load({
        "key": "0ba8e39d059d923f50967ee7563cba71",                                        
        "plugins": ['AMap.Geocoder'],                                      
      }).then((AMap)=>{
          map = new AMap.Map('amap-wrap',{
          center:[116.391467, 39.927761],
          resizeEnable:true,
          zoom:15
        })
        // console.log(map);
        marker = new AMap.Marker({
            position: [116.391467, 39.927761]
        })
        map.add(marker);
        map.on('click', function(e) {
          const data = getLngLat(e);
          marker.setPosition(data.value);
          emit('gnoteChange',data.value.join());
        });
      }).catch(e => {
          console.log(e);
      })

      const setMapCenter = (data)=>{
        // console.log(map);
        setTimeout(addressSetMapCenter(data,map))
      }
      return{
        // initAMap,
        setMapCenter,
      }
    }
}
</script>
<style lang="scss">
</style>