<template>
    <div>
        <el-card class="box-card" v-loading="loading">
            <el-button type="text" v-if="cp('--/home/home/edit')" @click="edit(true)">编辑</el-button>
            <el-form ref="submiteForm" :model="submiteForm" label-width="80px" style="width:400px;margin:0 auto">
                <el-form-item label="账号：">
                  
                    <span>{{submiteForm.user_account}}</span>
                </el-form-item>
                <el-form-item label="姓名：">
                   
                    <span>{{submiteForm.user_name}}</span>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input v-if="type=='edit'" v-model="submiteForm.user_mobile" size="small"></el-input>
                    <span v-else>{{submiteForm.user_mobile}}</span>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input v-if="type=='edit'" v-model="submiteForm.user_email" size="small"></el-input>
                    <span v-else>{{submiteForm.user_email}}</span>
                </el-form-item>
                <el-form-item v-if="type=='edit'" label="原密码：">
                    <el-input type="password" v-model="submiteForm.user_pwd" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="type=='edit'" label="新密码：">
                    <el-input type="password" v-model="submiteForm.user_pwd_new" size="small"></el-input>
                </el-form-item>
                <el-form-item v-if="type=='edit'">
                    <el-button type="primary" size="small" @click="submit">提交</el-button>
                    <el-button size="small" @click="edit(false)">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import message from '../../assets/js/message';
    import cp from '../../utils/checkPermissions';
    export default {
        name: "usercenter",
        data() {
            return {
                type:'view',
                loading:false,
                submiteForm:{
                    user_account:'',
                    user_name:'',
                    user_id:'',
                    user_mobile:'',
                    user_email:'',
                    user_pwd_new:'',
                    user_pwd:'',
                },
                serveData:{
                    
                }
            }
        },
        methods: {
            cp,
            init(){
               
                let user = localStorage._MyDaDao_user_data;
                if(user){
                    let u = JSON.parse(user);
                    this.submiteForm.user_account = u.user_account;
                    this.submiteForm.user_name = u.user_name;
                    this.submiteForm.user_id = u.user_id;
                    this.submiteForm.user_mobile = u.user_mobile;
                    this.submiteForm.user_email = u.user_email;
                }
    
            },
            edit(swi){
                if(swi){
                    this.type = 'edit';
                }else{
                    this.type = 'view';
                    this.init();
                }
            },
            submit(){
                let data = _.cloneDeep(this.submiteForm);
                delete data.user_account;
                delete data.user_name;
                this.loading = true;
                this.$http.post('/home/home/edit', data).then((response)=> {
                    this.loading = false;
                    let res=response.data;
                    if(res.code == 200){
                       message(this,res.message,'success')
                       this.$router.push('/login')
                    }else {
                       message(this,res.message,'error')
                    }
                }).catch((error)=> {
                    this.loading = false;
                });
            }
        },
        created() {
            this.init()
        },
        mounted() {
        },
        components: {},
        props: {},
        watch: {}
    }
</script>

<style scoped>

</style>
