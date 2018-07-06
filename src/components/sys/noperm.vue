<template>
    <div class="middle-box text-center animated fadeInDown">
        <h1>404</h1>
        <h3 class="font-bold">无权访问！</h3>

        <div class="error-desc">
            您暂无该页面的访问权限~
            <form class="form-inline m-t" role="form">
                <button type="btn" class="btn btn-primary" @click="$router.push({path:'/login'})">重新登录</button>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {},
        mounted() {
        },
        props: {},
        watch: {}
    }
</script>
<style lang="less">

</style>
