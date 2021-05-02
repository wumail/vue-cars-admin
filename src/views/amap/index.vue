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
    props:{
      disabled:{
        type:Boolean,
        default:false,
      },
      lnglat:{
        type:Array,
        default:[116.391467, 39.927761]
      }
    },
    setup(props,{emit}){
      var map=null;
      var marker = null;
      AMapLoader.load({
        "key": "0ba8e39d059d923f50967ee7563cba71",                                        
        "plugins": ['AMap.Geocoder'],                                      
      }).then((AMap)=>{
          map = new AMap.Map('amap-wrap',{
          center:props.lnglat,
          resizeEnable:true,
          zoom:15
        })
        // console.log(map);
        marker = new AMap.Marker({
            position: props.lnglat
        })
        map.add(marker);
        map.on('click', function(e) {
          if(!props.disabled){
            const data = getLngLat(e);
            marker.setPosition(data.value);
            emit('gnoteChange',data.value.join());
          }
        });
      }).catch(e => {
          console.log(e);
      })

      function mapDestory(){
        map && map.destroy();
      }

      const setMapCenter = (data)=>{
        // console.log(map);
        setTimeout(addressSetMapCenter(data,map))
      }
      return{
        // initAMap,
        props,
        setMapCenter,
        mapDestory,
      }
    }
}
</script>
<style lang="scss">
</style>