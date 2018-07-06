<template>
    <div id="wrapper">
        <navbar v-if="isLoading"></navbar>
        <page-wrapper v-if="isLoading"></page-wrapper>
        <right-sidebar v-if="isLoading"></right-sidebar>
    </div>
</template>

<script>
    import '../assets/css/common.css'
    import navbar from './navbar'
    import pageWrapper from './pageWrapper'
    import rightSidebar from './rightSidebar'

    export default {
        name: 'app',
        data(){
          return {
              isLoading:false
          }
        },
        components:{
            navbar,
            pageWrapper,
            rightSidebar
        },
        mounted(){
            this.$store.dispatch('loadingAction',false);
            this.isLoading=true;
            // this.$http.get('/dc-admin/sys/menu/getUserAllPerms').then((response)=>{
            //     var res=response.data;
            //     if(res.code==0){
            //        var permission=res.allPerms;
            //        permission.push('*')
            //        localStorage.permission=JSON.stringify(permission);
            //        setTimeout(()=>{
            //             this.isLoading=true;
            //        },200)
            //     }
            // })
        }
    }
</script>
<style lang="less">
    .el-table__row{
        font-size: 12px!important
    }
    .el-table thead{
        font-size: 12px!important;
        font-weight: 200!important;
    }
</style>
