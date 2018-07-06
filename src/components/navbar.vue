<template>
    <div class="navbar-default navbar-static-side" role="navigation">
        <div class="nav-close"><i class="fa fa-times-circle"></i>
        </div>
        <div style="height:60px;background:#367fa9;text-align:center;overflow:hidden">
            <span style="line-height:60px;color:white;font-size:16px;font-weight:300">大道<span v-show="isShowAll">用车运管平台</span>
            </span>

        </div>
        <div class="sidebar-collapse">
            <ul class="nav" id="side-menu">
                <!--nav-header-->
                <!-- <li class="nav-header">
                    
                    <nav-header></nav-header>
    
                </li> -->
                <!--nav-list-->
                <menu-List :lev=0 :item="item" v-for="item in dataList" :key="item.menu_id"></menu-List>
            </ul>
        </div>
    </div>
</template>

<script>
    import contabs from '../assets/js/contabs'
    import navinit from '../assets/js/navinit'
    import hplus from '../assets/js/hplus'
    import { mapState } from 'vuex';
    import navHeader from './navbar/navHeader'
    import menuList from './navbar/menuItem'

    export default {
        data() {
            return {
                dataList:[]
            }
        },
        created () {
            this.$store.dispatch('changeMessage',true)
        },
      
        methods: {
            
            initNav(){
                let req = {},
                    u_data_local = localStorage._MyDaDao_user_data,u_data;
                if(u_data_local){
                    u_data = JSON.parse(localStorage._MyDaDao_user_data);
                    req.user_id = u_data.user_id;

                    this.$http.post('/perm/role-menu',req).then((response) => {
                        var res = response.data;
                        if (res.code === 200) {
                            this.dataList = res.data;
                            this.$nextTick(()=>{
                                navinit();
                                contabs(this.$router,this.$store);
                                hplus();
                            })
                        }else{
                            this.$message({
                                message: res.message,
                                type: 'error'
                            });
                        }
                    }).catch((error) => {

                    });
                }else{
                    this.$router.push('/login');
                }
            }
        },
        computed:{
            ...mapState({
                isShowAll:state => state.user.isShowAll,
            })
        },
        mounted() {
            this.initNav();
            this.$store.dispatch('GetUserRoles')
        },
        props: {},
        watch: {},
        components: {
            navHeader,
            menuList
        }
    }
</script>
<style lang="less">
    .sidebar-collapse{
        padding-bottom: 60px;
    }
</style>
