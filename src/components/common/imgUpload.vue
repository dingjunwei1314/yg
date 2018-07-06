<template>
    <div class="img-add">
        <input 
        id="File"
        type="file" 
        style="display:none" 
        :ref="iRef"
        accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" 
        @change="importf($event)" />

        <el-button :loading="btnLoading" size="mini" style="width:100px" type="primary" @click="importClick(iRef)">浏览</el-button>
    </div>
</template>


<script>
    import qs from 'qs'
    import axios from 'axios'
    import message from '../../assets/js/message'
    import sendLog from '@/utils/sendLog'
    import {PREFIX} from '../../config/app'
    import { getToken, removeToken, getAppId } from '@/utils/appCookie'
    import {isOpenCollection} from '@/config/app'
    
    export default {
        props:{
            iRef:{
                default:'inputFile'
            },
            userId:{
                default:''
            },
        },
        data() { 
            return {
                btnLoading:false,
            }
        },
        mounted() {
            
        },
        methods: {
            
            importClick(i){
                this.$refs[i].click()               
            },
            
            async importf(obj) {//导入
                if(!obj.target.files) {
                    message(this,'文件类型不符合要求','error');
                    return;
                }
                let f = obj.target.files[0],
                size = f.size;
                // console.log(size)
                if(size>(10*1024*1024)){
                    message(this,'图片大小不能超过10兆','error');
                    this.$refs[this.iRef].value = '';
                    return;
                }
                let formData = new FormData();
                let timeStr = new Date().valueOf().toString().slice(0,-3);
                let sign = md5(timeStr+'incar');
                formData.append('file', f);
                formData.append('uid', this.userId); 
                formData.append('timestamp', timeStr);
                formData.append('sign', sign);
                this.$refs[this.iRef].value = '';
                let logInfo, headers
                if (isOpenCollection) {
                    logInfo = await sendLog('/staff/upload/file', {}, {
                        action: 'upload',
                        comment: '上传图片'
                    })
                    headers = {
                        'Content-Type':'multipart/form-data',
                        'x-operate-id':logInfo.id,
                        'x-incar-request-uri':'/staff/upload/file',
                        'x-incar-request-moudle':'oms',
                        'x-incar-app-id':getAppId(),
                        'x-incar-token':getToken()
                    }
                } else {
                    headers = {
                        'Content-Type':'multipart/form-data',
                        'x-incar-request-uri':'/staff/upload/file',
                        'x-incar-request-moudle':'oms',
                        'x-incar-app-id':getAppId(),
                        'x-incar-token':getToken()
                    }
                }
                this.btnLoading = true;
                axios({
						method: 'post',
                        url: `${PREFIX}/staff/upload/file`,
                        data:formData,
                        headers
                        // withCredentials:true
					}).then(response => {
                        this.btnLoading = false;
                        let data = response.data;
                        if(data.errCode == 0){
                            let imgId = data.attachment.imgId
                            this.$emit('uploadSuccess',{res:imgId,iRef:this.iRef})
                        }else{
                            message(this,data.message,'error')
                        }

              

                    }).catch((error) =>{
                        console.log(error)
                        this.btnLoading = false;
                    })
                
            },
           
        },
        watch: {}
    }
</script>
<style lang="less">
    .img-add{
        width: 100px
    }
</style>
