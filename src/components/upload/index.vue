<template>
  <el-upload
    class="avatar-uploader"
    action="https://up-z1.qiniup.com"
    :data='uploadData'
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img
      v-if="image.imageUrl"
      :src="image.imageUrl"
      class="avatar"
    >
    <i
      v-else
      class="el-icon-plus avatar-uploader-icon"
    ></i>
  </el-upload>
</template>

<script>
import { onBeforeMount, ref,reactive, watch } from 'vue';
import { GetQiniuToken } from "@/api/common.js";

export default {
    name:'Upload',
    emits:['uploadImgUrl'],
    props:{
        url:{
            type:String,
            default:'',
        },
        upLoadProp:{
            type:String,
            default:''
        }
    },
    setup(props,{emit}){
        // console.log('');
        const image = reactive({
            imageUrl:'',
        })

        const uploadData = reactive({
            token:'',
        })

        function handleAvatarSuccess(res, file) {
            image.imageUrl = `http://qt1g6yd9r.hb-bkt.clouddn.com/${res.key}`
            emit('uploadImgUrl',{
                object:props.upLoadProp,
                value:image.imageUrl 
            })
        }

        function  beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            const filename = file.name;
            let key = encodeURI(filename);
            uploadData.key = key;
            return isJPG && isLt2M;
        }

        function getQiniuToken(){
            const requestData ={
                ak:'PDsDtt9NpgVJFph3zn3wA5w0FSt9IvQoewQGa8-f',
                sk:'LGXLPSOAmDABqm76-Y6vOeYmxJvx7g1PA-3rdBgg',
                buckety:'vue-car'
            }
            GetQiniuToken(requestData).then((response)=>{
                const data =response.data;
                if(data){
                uploadData.token = data.token
                }
            })
        }

        watch(()=>props.url,(now) => {
            image.imageUrl = now
        }
        ,{
            immediate:true
        })

        onBeforeMount(()=>{
            getQiniuToken()
        })
        return{
            handleAvatarSuccess,
            beforeAvatarUpload,
            image,
            uploadData,
        }
    }
}
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>