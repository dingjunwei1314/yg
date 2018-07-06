<template>
    <el-select 
        :clearable="clearable"
        :filterable="filterable"
        @change="select"
        :disabled="isDisabled"
        @focus="focus"
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
                return ['id','value','data']
            }
        },
        valProp:{
            default:''
        },
        preloadedSwi:{
            default:false
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
        isDisabled:{
            default:false
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
            dataList:[],
            filterForm:{
                valProp:''
            }
        }
    },
    created(){
        this.preloaded();
    },
    watch:{
        'valProp':{
            handler(val){
                this.filterForm.valProp = val;
            },
            deep:true
        }
    },
    methods:{
        init(){
            let data;
            if(this.url == '/city/city/all'){
                let u = localStorage._MyDaDao_user_data,role_id;
                if(u){
                    role_id = JSON.parse(u).role_id;
                    data = {role_id}
                }
            }else{
                data = {}
            }
            this.$http.post(this.url,data).then((response) => {
                var res = response.data;
                if (res.code === 200) {
                    this.dataList = res[this.config[2]];
                }
            })
        },
        preloaded(){
            if(this.preloadedSwi){
                this.init()
            }
        },
        focus(){
            if(this.dataList.length <= 0){
                this.init()
            }
        },
        select(val){
            this.$emit('update:valProp',val);
        }
    }
}
</script>
<style scoped>
    
</style>



