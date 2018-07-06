<template>
    <div class="dropdown profile-element">
        
        <span>
            <img alt="image" style="margin-left:-6px" class="img-circle" src="/static/img/profile_small.png"/>
        </span>
        <a data-toggle="dropdown" class="dropdown-toggle" href="#">
            <span class="clear">
                <span class="block m-t-xs">
                    <strong class="font-bold">{{role.user_account}}</strong>
                </span>
                <span class="text-muted text-xs block">
                    {{role.role_name}}<b class="caret"></b>
                </span>
            </span>
        </a>
        <ul class="dropdown-menu animated fadeIn m-t-xs">
            <!-- <li><a class="J_menuItem" href="form_avatar.html">修改头像</a>
            </li>
            <li><a class="J_menuItem" href="profile.html">个人资料</a>
            </li>
            <li><a class="J_menuItem" href="contacts.html">联系我们</a>
            </li>
            <li><a class="J_menuItem" href="mailbox.html">信箱</a>
            </li>
            <li class="divider"></li> -->
            <li>
                <router-link :to="{ path: 'login' }">安全退出</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                role:{
                    user_account:'',
                    role_name:''
                }
            }
        },
        methods: {
            init(){
                let u_data_local = localStorage._MyDaDao_user_data,u_data;
                if(u_data_local){
                    u_data = JSON.parse(localStorage._MyDaDao_user_data);
                    this.role.user_account = u_data.user_account;
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
        watch: {}
    }
</script>
<style lang="less">

</style>
