<template>
  <div>
    <svg
      class="svg-icon"
      aria-hidden="true"
    >
      <use :xlink:href="iconName"></use>
    </svg>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
    name:'SvgIcon',
    props:{
        icon_Name:{
            type:String,
            default:'',
        },
        icon_Class:{
            type:String,
            default:'',
        },
    },
    setup(props){
        const iconName = computed(()=>`#icon-${props.icon_Name}`);
        return{
            props,
            iconName,
        }
    },
}
</script>

<style lang="scss">
.svg-icon {
  padding-right: 10px;
  width: 1em;
  height: 1em;
  //   color: #fff;
  fill: currentColor;
}
</style>