<template>
    <div class="login-box" @keyup.enter="login">
        <div class="login-con">
            <el-card class="box-card">
                <h3>欢迎登录 大道用车</h3>

                <el-form ref="form">
                    <el-form-item label="">
                        <el-input prefix-icon="fa fa-user" auto-complete="off" v-model="user_account" size="small" placeholder="用户名"></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-input prefix-icon="fa fa-lock" auto-complete="off" v-model="user_pwd" size="small" type="password"  placeholder="密码"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button style="width:100%;height:30px;line-height:30px;padding:0;font-size:12px;" type="primary" @click="login">登录</el-button>
                    </el-form-item>
                    </el-form>
            </el-card>
        </div>
    </div>
</template>

<script>
    import message from '../assets/js/message'
    import { setToken, setAppId, setUserId } from '@/utils/appCookie'
    export default {
        data() {
            return {
                user_account:'',
                user_pwd:'',
            }
        },
        methods: {
            login(){
                var req={
                    user_account:this.user_account,
                    user_pwd:md5(this.user_pwd)
                }
            
                this.$http.post('/login/login', req).then((response)=> {
                   var res = response.data
                   if(res.code === 200){

                       this.$store.dispatch('setUserInfo', res.data)
                       setToken(response.headers['x-incar-token']) // 模拟存储一个token
                       setAppId('c21517de574f415f955c256fc3a1b50a')
                       setUserId(res.data.user_id)
                      
                       localStorage._MyDaDao_user_data = JSON.stringify(res.data)
                       localStorage.user_id = res.data.user_id
                       this.$router.push({path:'/index'})
                       
                   }else {
                       message(this,res.message,'error')
                   }
                }).catch((error)=> {
                    console.log(error)
                })

            }
        },
        mounted() {
            setToken('')
            setAppId('')
            this.user_account = ''
            this.user_pwd = ''
        },
        props: {},
        watch: {}

        
    }
</script>
<style lang="less">
    .login-box{
        background: url('../assets/img/login_bg.jpg');
        background-size:cover;
        background-position:center;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .login-con{
        position: absolute;
        right: 160px!important;
        top: 50%;
        width: 300px!important;
        transform: translateY(-50%);
    }
</style>
