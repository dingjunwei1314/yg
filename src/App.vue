<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: 'app',
        data(){
            return{
                
            }
        }
    }
</script>

<style>
    .el-notification{
        z-index: 5000 !important;
    }
    .el-form-item__label{
        font-size: 12px!important;
        
    }
    .viewer-button{
        right: -20px!important;
    }
</style>
