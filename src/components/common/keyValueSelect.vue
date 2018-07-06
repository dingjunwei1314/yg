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
            v-for="(v,k) in datsList"
            :key="k"
            :label="v"
            :value="k">
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
                return ['code','data']
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
        }
	},
    data(){
        return {
            datsList:[],
            filterForm:{
                valProp:''
            }
        }
    },
    created(){
        this.init();
    },
    watch:{

    },
    methods:{
        init(){
            this.$http.post(this.url).then((response) => {
                var res = response.data;
                if (res[this.config[0]] === 200) {
                    this.datsList = res[this.config[1]];
                }
            })
        },
        select(val){
            this.$emit('update:valProp',val)
        }
    }
}
</script>
<style scoped>

</style>



