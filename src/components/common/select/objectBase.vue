<template>
    <el-select
        :clearable="clearable"
        :filterable="filterable"
        @change="select"
        v-model="filterForm.valProp"
        size="small"
        :placeholder="placeholder"
        :style="styleObj">
            <el-option
            v-for="(v,k) in dataList"
            :key="k"
            :label="v"
            :value="k">
            </el-option>
    </el-select>
</template>
<script>
export default {
    props:{
        valProp:{
            default:''
        },
        dataList:{
            default:[]
        },
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
        }
	},
    data(){
        return {
            filterForm:{
                valProp:''
            }
        }
    },
    methods:{
        select(val){
            this.$emit('update:valProp',val)
        }
    },
    watch:{
        valProp(val){
            this.filterForm.valProp = val
        }
    }
}
</script>
<style scoped>

</style>



