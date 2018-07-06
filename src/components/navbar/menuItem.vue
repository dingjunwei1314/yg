<template>
    <li>
        <!--v-checkup="item.perms"-->
    	<a v-if="item.type == '1'" href="#">
        		<i v-if="item.img != null" :class="item.img"></i>
        		<span class="nav-label">{{item.menu_name}}</span>
        		<span class="fa arrow"></span>
        </a>
    	<ul v-if="item.type == '1'" class="nav nav-second-level" :class="'lev'+lev">
        		<menu-list :lev=lev+1 :item="item" v-for="item in item.child" :key="item.menu_id"></menu-list>
        </ul>
    	<a v-if="item.type == '2'" :href="item.page_url" class="J_menuItem"><i v-if="item.img != null" :class="item.img"></i><i v-else class="fa fa-circle-o"></i> {{item.menu_name}}</a>
    </li>
</template>

<script>
    import menuList from './menuItem'
    export default {
        name: 'menu-list',
        data() {
            return {
            }
        },
        methods: {
        },
        mounted() {
            
        },
        props: {
            item:{},
            lev:{
                required:true
            }
        },
        computed:{
        },
        watch: {},
        components:{
            menuList
        }
    }
</script>
<style lang="less">
    .lev1 .J_menuItem{
        padding-left: 68px;
    }
</style>
