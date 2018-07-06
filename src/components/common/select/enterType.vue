<template>
    <objectBase :valProp.sync="value"
                :dataList="dataList"
                :clearable="clearable"
                :filterable="filterable"
                size="small"
                :placeholder="placeholder"
                :style="styleObj"></objectBase>
</template>

<script>
    import objectBase from './objectBase'
    export default {
        name: "entertype",
        data() {
            return {
                dataList:[],
                value:'',
            }
        },
        created() {
            this.$store.dispatch('GetEnery').then(res =>{
                this.dataList=res;
            })
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
