<template>
  <el-cascader
    v-model="area"
    :options="cascader_options"
    :props="cascader_props"
    @change="changeValue"
  ></el-cascader>
</template>

<script>
import { reactive, ref } from 'vue';
import { GetCity } from '@/api/common.js';

export default {
    name:'CityArea',
    emits:["areaChange","setMapCenter"],
    props:{
        areavalue:{
            type:String,
            default:'',
        }
    },
    setup(props,{emit}){
        let area=ref('');
        const cascader_options = reactive(
            [
            ]
        )

        const address = ref([]);
        const addressData = ref({});
        const cascader_props = reactive(
            {
            lazy: true,
            lazyLoad (node, resolve) {
                const level = node.level;
                const reqdata = {};
                const Type = {
                0: { type: "province" },
                1: { type: "city", code: "province" },
                2: { type: "area", code: "city" }
                        }
                if(Type[level].code) { 
                reqdata[`${Type[level].code}_code`] = node.value 
                }
                reqdata.type = Type[level].type;

                GetCity(reqdata).then(response=>{
                // console.log(response);
                const data = response.data.data;
                const type = Type[level].type.toUpperCase();

                data.forEach(item => {
                    item.value = item[`${type}_CODE`];
                    item.label = item[`${type}_NAME`];
                    // 最后一层选择
                    if(level === 2) { item.leaf = level >= 2; }
                })
                addressData.value[Type[level].type] = data;
                resolve(data);
                })
                if(node.level !== 0){
                    getAddress(node)
                }
            }
            }
        )

        const changeValue = ()=>{
            const last = area.value[area.value.length-1];
            const __area = addressData.value.area.filter(item=>item.value == last)[0];
            address.value[2]=__area.label;
            emit('setMapCenter',address.value.join(''));
            emit('areaChange',area.value.join());
        }

        const getAddress = (node) =>{
            let level = node.level-1;
            address.value[level] = node.label;
            // console.log(address.value.join());
            emit('setMapCenter',address.value.join(''));
        }

        return{
            cascader_options,
            cascader_props,
            area,
            changeValue,
            getAddress,
        }
    }
}
</script>

<style>
</style>