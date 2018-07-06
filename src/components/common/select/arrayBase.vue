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
            v-for="item in dataList"
            :key="item[config[0]]"
            :label="item[config[1]]"
            :value="item[config[0]]">
            </el-option>
    </el-select>
</template>
<script>
export default {
    props:{
		url:{
            default:''
        },
        config:{
            default:function(){
                return ['id','value']
            }
        },
        valProp:{
            default:''
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
        },
        dataList:{
            default:function(){
                return []
            }
        },
	},
    data(){
        return {
            filterForm:{
                valProp:''
            }
        }
    },
    mounted(){
        this.filterForm.valProp = this.valProp;
    },
    methods:{
        select(val){
            this.$emit('update:valProp',val)
        },
        
    },
    watch:{
        valProp(val){
            this.filterForm.valProp = val;
        }
    }
}
</script>
<style scoped>

</style>



