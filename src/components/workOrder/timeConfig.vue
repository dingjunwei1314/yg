<template>
    <div class="time-config">
      
        <el-row>
           
                <el-form :model="configForm" label-width="300px">
                    <el-form-item label="超长未处理工单 超时时间（单位小时）：">
                        <el-input  
                        v-model="configForm.unfinished" 
                        type="number"
                        size="small" style="width:155px"></el-input>
                        <el-button v-if="cp('--/work/abnormal/config/edit')" size="small" type="text" style="margin-left:20px" @click="submit(1)">提交</el-button>
                        <span style="color:red;font-size:12px;margin-left:10px"> 注：以工单创建时间计算</span>
                    </el-form-item>
                    <el-form-item label="超长未完成工单 超时时间（单位小时）：">
                        <el-input  
                        v-model="configForm.nothandle" 
                        type="number"
                        size="small" 
                        style="width:155px"></el-input>
                        <el-button v-if="cp('--/work/abnormal/config/edit')" size="small" type="text" style="margin-left:20px" @click="submit(2)">提交</el-button>
                        <span style="color:red;font-size:12px;margin-left:10px"> 注：以地服接单时间计算</span>
                    </el-form-item>
                </el-form>
           
        </el-row>
      
    </div>
</template>

<script>
    import message from '../../assets/js/message';
    import sourceSelect from '../common/sourceSelect';
    import {timeConfig,getTimeConfig} from '../../api/timeConfig';

    import cp from '../../utils/checkPermissions'
    export default {
        components:{
            sourceSelect
        },
        data() {
            return {
                configForm:{
                    unfinished:'',
                    nothandle:''
                }
            }
        },
        created(){
            this.init()
        },
        mounted() {
           
        },
        filters:{
           
        },
        methods: {
            cp,
            init(){
                this.$store.dispatch('loadingAction',true);
                getTimeConfig(1).then(res => {
                    this.$store.dispatch('loadingAction',false);
                    if(res.code === 200){
                        this.configForm.unfinished = res.data.hour
                    }else{
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('loadingAction',false);
                });
                getTimeConfig(2).then(res => {
                    this.$store.dispatch('loadingAction',false);
                    if(res.code === 200){
                        this.configForm.nothandle = res.data.hour
                    }else{
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('loadingAction',false);
                })
            },
            submit(type){
                let config = {};
                if(type == 1){
                    config.id = 1;
                    config.hour = this.configForm.unfinished;
                }else{
                    config.id = 2;
                    config.hour = this.configForm.nothandle;
                }
                if(isNaN(Number(config.hour))){
                    message(this,'必须是整数','error')
                    return;
                }

                if(!Number.isInteger(Number(config.hour))){
                    message(this,'必须是整数','error')
                    return;
                }

                if(Number(config.hour)>1000){
                    message(this,'不能大于1000','error')
                    return;
                }
                
                this.$store.dispatch('loadingAction',true);
                timeConfig(config).then(res => {
                    this.$store.dispatch('loadingAction',false);
                    if(res.code === 200){
                        message(this,'修改成功','success')
                    }else{
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('loadingAction',false);
                })
            }
        },
        props: {},
        watch: {}
    }
</script>
<style lang="less">
.time-config{
    background: white;
    padding: 40px 20px 20px;
}

</style>
