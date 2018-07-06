<template>
    <objectBase :valProp.sync="value"
                :dataList="dataList"
                :clearable="clearable"
                :filterable="filterable"
                size="small"
                :placeholder="placeholder"
                :style="styleObj"
                :config="['id','name','phone_num']"
    ></objectBase>
</template>

<script>
    import objectBase from './arrayBaseDouble'
    export default {
        name: "citys",
        data() {
            return {
                dataList:[],
                value:'',
            }
        },
        created() {
            this.$store.dispatch('GetStaffUserList').then(res =>{
                this.dataList = res;
            })
            this.value = this.valProp;
        },
        components: {
            objectBase
        },
        props: {
            placeholder:{
                default:'请选择'
            },
            styleObj:{
                default:function(){
                    return{
                        width:'155px'
                    }
                }
            },
            filterable:{
                default:true
            },
            clearable:{
                default:true
            },
            valProp:{
                default:''
            }
        },
        watch: {
            value(){
                this.$emit('update:valProp',this.value)
            },
            valProp(val){
                this.value = val
            }
        }
    }
</script>

<style scoped>

</style>
