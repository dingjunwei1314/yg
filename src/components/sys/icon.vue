<template>
    <div class="icon-select" >
        <el-button @click="isshow=true" :icon="icon">{{ishas?'':'选择图标'}}</el-button>
        <transition name="el-fade-in-linear">
            <div class="icon-list" v-show="isshow">
                <el-button v-for="item in iconList" :key="item" :icon="item" size="mini" @click="choose(item)"></el-button>
            </div>
        </transition>
    </div>
</template>

<script>
    import iconList from '../../assets/iconList'
    export default {
        data() {
            return {
                ishas:false,
                isshow:false,
                icon:'',
                iconList:iconList
            }
        },
        methods: {
            choose(icon){
                this.isshow=false;
                this.icon=icon;
                this.ishas=true;
                this.$emit('input',icon);
            }
        },
        mounted() {
            if(iconList.indexOf(this.value)>=0){
                this.icon=this.value;
                this.isshow=false;
                this.ishas=true;
            }else{
                // this.$notify.error({
                //     title: '错误',
                //     message: '请选择图标库里面的图标'
                // });
            }
        },
        props: {
            value:''
        },
        watch: {
            value(){
                if(iconList.indexOf(this.value)>=0){
                    this.icon=this.value;
                    this.isshow=false;
                    this.ishas=true;
                }else{
                    this.$notify.error({
                        title: '错误',
                        message: '请选择图标库里面的图标'
                    });
                }
            }
        }
    }
</script>
<style lang="less">
.icon-select{
    position: relative;
    .icon-list{
        position: absolute;
        left: 0;
        top:0;
        background: white;
        border: 1px solid #ddd;
        width: 280px;
        padding: 20px;
        box-sizing: border-box;
        .el-button+.el-button{
            margin-left: 0px;
        }
    }
}
</style>
