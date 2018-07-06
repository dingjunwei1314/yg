<template>
    <div id="page-wrapper" class="gray-bg dashbard-1" v-loading="loading">
    
        <div class="row border-bottom">
            <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                <div class="navbar-header">

                    <a class="navbar-minimalize minimalize-styl-2" @click="navSwi" href="javascript:;"><i style="color:white" class="fa fa-bars"></i> </a>

                    
                </div>
                
                <el-button type="text" @click="loginOut" style="float:right;color:white;margin-top:14px;margin-right:15px;font-size:13px">退出登录</el-button>
                <span style="float:right;color:white;line-height:60px;font-size:13px;margin-right:10px;">{{role.user_name}}</span>
                <!-- <el-button type="text" @click="edit" style="float:right;color:white;margin-top:10px;margin-right:20px">修改资料</el-button> -->
                
                <!-- <ul class="nav navbar-top-links navbar-right">
                    <li class="dropdown">
                        <a class="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                            <i class="fa fa-bell"></i> <span class="label label-primary">8</span>
                        </a>

                        <dropdown-alerts></dropdown-alerts>
                    </li>
                    <li class="dropdown hidden-xs">
                        <a class="right-sidebar-toggle" aria-expanded="false">
                            <i class="fa fa-tasks"></i> 主题
                        </a>
                    </li>
                </ul> -->
            </nav>
        </div>
        <div class="row content-tabs">

            <button class="roll-nav roll-left J_tabLeft"><i class="fa fa-backward"></i>
            </button>
            <nav class="page-tabs J_menuTabs">
                <div class="page-tabs-content">
                    <a href="javascript:;" class="active J_menuTab" data-id="/index"  data-pid="index">欢迎</a>
                </div>
            </nav>
            <button class="roll-nav roll-right J_tabRight"><i class="fa fa-forward"></i>
            </button>
            <div class="btn-group roll-nav roll-right">
                <button class="dropdown J_tabClose" data-toggle="dropdown">关闭操作<span class="caret"></span></button>
                <ul role="menu" class="dropdown-menu dropdown-menu-right">
                    <li class="J_tabShowActive"><a>定位当前选项卡</a>
                    </li>
                    <li class="divider"></li>
                    <li class="J_tabCloseAll"><a>关闭全部选项卡</a>
                    </li>
                    <li class="J_tabCloseOther"><a>关闭其他选项卡</a>
                    </li>
                </ul>
            </div>
            <!-- <a href="javascript:;" class="roll-nav roll-right J_tabExit" @click="logout"><i class="fa fa fa-sign-out"></i> 退出</a> -->
        </div>
        <div class="row J_mainContent" id="content-main" style="padding: 20px;">
                <keep-alive :include="includes">
                    <router-view></router-view>
                </keep-alive>
                <!-- <router-view  v-if="!$route.meta.keepAlive"></router-view> -->
        </div>
        <!-- <div class="footer">
            <div class="pull-right">&copy; 2014-2015 <a href="/" target="_blank">DC-ADMIN</a>
            </div>
        </div> -->
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import dropdownAlerts from './pageWrapper/dropdownAlerts'
    export default {
        data() {
            return {
                // includes:[]
                role:{
                    user_name:'',
                    role_name:''
                }
            }
        },
        computed:{
            ...mapState({
                loading:state => state.user.loading,
                includes:state => state.permission.includes
            })
        },
        methods: {
            loginOut(){
                this.$router.push({path:'/login'})
            },
            edit(){
                this.$router.push({path:'/usercenter'})
            },
            navSwi(){
                this.$store.dispatch('isShowAllAction')
            },
            init(){
                let u_data_local = localStorage._MyDaDao_user_data,u_data;
                if(u_data_local){
                    u_data = JSON.parse(localStorage._MyDaDao_user_data);
                    this.role.user_name = u_data.user_name;
                    this.role.role_name = u_data.role_name;
                }else{
                    this.$router.push('/login');
                }
            }
        },
        mounted() {
            this.init()
        },
        props: {},
        watch: {},
        components:{
            dropdownAlerts
        }
    }
</script>
<style>
    .el-loading-mask{
        top:103px!important;
        bottom:0px;
    }
</style>
