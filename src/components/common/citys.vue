<template>
    <div>
        <el-checkbox v-model="checked" @change="all">全选</el-checkbox>
        <el-checkbox-group v-model="city_idss">
            <el-checkbox v-for="item in cityList" :key="item.baiduid" :label="item.baiduid">{{item.cityname}}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>
<script>
export default {
    props:{
		cityids:{
            default(){
                return []
            }
        }
	},
    data(){
        return {
            cityList:[],
            city_idss:[],
            checked:false
        }
    },
    created(){
        this.init();
        this.city_idss = _.cloneDeep(this.cityids)
    },
    watch:{
        'cityids':{
            handler(val){
                this.city_idss = val;
            },
            deep:true
        },
        'city_idss':{
            handler(val){
                this.checked = val.length === this.cityList.length;
                this.$emit('update:cityids',val);
            },
            deep:true
        }
    },
    methods:{
        init(){
            let u = localStorage._MyDaDao_user_data,role_id;
            if(u){
                role_id = JSON.parse(u).role_id;
            }
            this.$http.post('/city/city/all',{role_id}).then((response) => {
                var res = response.data;
                if (res.code === 200) {
                    this.cityList = res.data;
                }
            })
            
        },
        all(val){
            if(val){
                this.city_idss = [];
                this.cityList.forEach(item => {
                    this.city_idss.push(item.baiduid)
                })
            }else{
                this.city_idss = [];
            }
        }
    }
}
</script>
<style scoped>
    
</style>



