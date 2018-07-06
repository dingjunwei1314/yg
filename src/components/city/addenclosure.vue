<template>
    <div class="add-en">
        <el-card class="box-card">
            <el-button type="text" @click="back">返回</el-button>
            <el-form ref="submiteForm" :model="submiteForm" :rules="rules" label-width="110px" style="width:100%;margin:0 auto">
                <el-form-item label="围栏名称：" prop="name">
                    <el-input style="width:200px" v-model="submiteForm.name" size="small"></el-input>
                </el-form-item>
                <el-form-item label="基础点定位：">
                    <el-row>
                        <div>
                            <el-col :span="18">
                                <el-input v-model="submiteForm.address" size="small"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <el-button size="small" type="primary" style="margin-left:10px" @click="showMap">地址定位</el-button>
                            </el-col>
                        </div>

                        <div>
                            <el-col :span="18">
                                <div v-show="mapDialog" style="margin:20px 0px">
                                    <baidu-map 
                                        :center="center" 
                                        class="map" 
                                        :scroll-wheel-zoom="true" 
                                        @click="markAddress"
                                        :zoom="zoom" 
                                        @ready="handler">
                                        <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
                                        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

                                        <bm-local-search :panel="false" :keyword="keyword"  :auto-viewport="true" :location="location"></bm-local-search>
                                        
                                        <bm-marker 
                                        :position="{lng: this.submiteForm.longitude, lat: this.submiteForm.latitude}" 
                                        :icon="{url: imgUrl, size: {width: 32,height:32}}"
                                        @dragend="dragend"
                                        :dragging="true">
                                            
                                        </bm-marker>
                                    </baidu-map>
                                </div>
                            </el-col>
                        </div>
                    </el-row>
                </el-form-item>
                <el-form-item label="当前经度："  prop="latitude">
                    <el-input style="width:200px" v-model="submiteForm.latitude" disabled size="small"></el-input>
                </el-form-item>
                <el-form-item label="当前纬度："  prop="longitude">
                    <el-input style="width:200px" v-model="submiteForm.longitude" disabled size="small"></el-input>
                </el-form-item>
                <el-form-item label="围栏类型：" prop="parkLevel">
                    <el-select size="small" v-model="submiteForm.parkLevel" placeholder="请选择">
                        <el-option
                        label="报警围栏"
                        :value="3">
                        </el-option>
                        <el-option
                        label="核心服务区围栏"
                        :value="2">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可用状态：" prop="status">
                    <el-radio-group v-model="submiteForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="submit('submiteForm')">提交</el-button>
                    <el-button size="small" @click="back">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        
    </div>
</template>

<script>
    import message from '../../assets/js/message';
    import cp from '../../utils/checkPermissions';
    export default {
        data() {

            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('名称不能为空'));
                }
                if(value.length>60){
                    return callback(new Error('名称最长60位'));
                }
                callback();
            };

            var checkParkLevel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('类型不能为空'));
                }
                callback();
            };

            var checkLatitude = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('经度不能为空'));
                }
                callback();
            };

            var checkLongitude= (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('纬度不能为空'));
                }
                callback();
            };

            var checkStatus = (rule, value, callback) => {
                if (value==='') {
                    return callback(new Error('状态不能为空'));
                }
                callback();
            };
            
            return {
                center: {lng: 0, lat: 0},
                location:'北京市',
                zoom: 3,
                keyword:'',
                imgUrl:'static/img/locked.png',
                mapDialog:false,
                submiteForm:{
                    name:'',
                    address:'',
                    latitude:'',
                    longitude:'',
                    parkLevel:'',
                    status:'',
                    areaCode:'',
                },
                rules: {
                    name:[
                        { validator: checkName, trigger: 'blur' }
                    ],
                    parkLevel:[
                        { validator: checkParkLevel, trigger: 'change' }
                    ],
                    status:[
                        { validator: checkStatus, trigger: 'change' }
                    ],
                    latitude:[
                        { validator: checkLatitude, trigger: 'change' }
                    ],
                    longitude:[
                        { validator: checkLongitude, trigger: 'change' }
                    ]
                },
            }
        },
        methods: {
            cp,
            initData(){
                if(!(this.$route.query.id)){
                    return
                }
                this.mapDialog = true
                let req = {
                    id:this.$route.query.id
                }
                this.$store.dispatch('loadingAction',true)
                this.$http.post(`/staff/park/findById/${req.id}`, req, null, {serveType:1, args: {}, module: 'staff'}).then((response)=> {
                    this.$store.dispatch('loadingAction',false)
                    let res=response.data
                    if(res.errCode == 0){
                        this.submiteForm = res.attachment
                        this.submiteForm = _.cloneDeep(this.submiteForm)
                        let ggPoint = new BMap.Point(this.submiteForm.longitude,this.submiteForm.latitude)
                        this.switchAddress(ggPoint)
                    }else {
                        message(this,res.message,'error')
                    }
                }).catch((error)=> {
                    console.log(error)
                    this.$store.dispatch('loadingAction',false)
                })
            },
            handler ({BMap, map}) {
                this.center.lng = 116.404
                this.center.lat = 39.915
                this.zoom = 15
                if(this.$route.query.cityname){
                    this.location = this.$route.query.cityname
                }
                this.geoc = new BMap.Geocoder() 
            },
            switchAddress (point) {
                this.geoc.getLocation(point, rs => {
                    var addComp = rs.addressComponents
                    if (addComp.province) {
                        this.zoom = 15
                        this.center = {lng:this.submiteForm.longitude,lat:this.submiteForm.latitude}
                        this.submiteForm.address = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
                        
                    } else {
                        this.submiteForm.address = ''
                        if (cityname) {
                            this.center = this.$route.query.cityname
                            this.zoom = 10
                        }
                    }
                })     
            },
            markAddress({type, target, point, pixel, overlay}){
                this.submiteForm.longitude = point.lng;
                this.submiteForm.latitude = point.lat;
            },
            dragend({type, target, pixel, point}){
                this.submiteForm.longitude = point.lng;
                this.submiteForm.latitude = point.lat;
            },
            showMap(){
                this.keyword = this.submiteForm.address;
                if(!this.keyword){
                    message(this,'请先输入基础点定位','error');
                    return;
                }
                this.mapDialog = true;
            },
            searchcomplete(val){
               
            },
            init(){
                let user = localStorage._MyDaDao_user_data;
                if(user){
                    let u = JSON.parse(user);
                    this.submiteForm.user_account = u.user_account;
                    this.submiteForm.user_name = u.user_name;
                    this.submiteForm.user_id = u.user_id;
                    this.submiteForm.user_mobile = u.user_mobile;
                    this.submiteForm.user_email = u.user_email;
                }
    
            },
            back(){
                this.$router.push({
                    path:'/city/setenclosure',
                    query:{
                        cityname:this.$route.query.cityname,
                        baiduid:this.$route.query.baiduid
                    }
                })
            },
            submit(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.submiteForm.areaCode = this.$route.query.baiduid
                        let data = _.cloneDeep(this.submiteForm)
                        let req = '/staff/park/add'
                        delete data.address

                        this.$confirm('确认提交吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$store.dispatch('loadingAction',true);
                            this.$http.post(req, data).then((response)=> {
                                this.$store.dispatch('loadingAction',false);
                                let res=response.data
                                if(res.errCode == 0){
                                    message(this,res.message,'success')
                                    this.$router.push({
                                        path:'/city/setenclosure',
                                        query:{
                                            cityname:this.$route.query.cityname,
                                            baiduid:this.$route.query.baiduid
                                        }
                                    })
                                }else {
                                    message(this,res.message,'error');
                                }
                            }).catch((error)=> {
                                console.log(error)
                                this.$store.dispatch('loadingAction',false);
                            });
                        }).catch(() => {
                        })

                        if (this.$route.query.type === 'edit') {
                            req = '/staff/park/update-fence'
                            data.id = data.parkId
                            delete data.parkId

                            this.$confirm('确认提交吗？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.$store.dispatch('loadingAction',true);
                                this.$http.post(req, data, null, {serveType:1, args: data, module: 'staff'}).then((response)=> {
                                    this.$store.dispatch('loadingAction',false);
                                    let res=response.data
                                    if(res.errCode == 0){
                                        message(this,res.message,'success')
                                        this.$router.push({
                                            path:'/city/setenclosure',
                                            query:{
                                                cityname:this.$route.query.cityname,
                                                baiduid:this.$route.query.baiduid
                                            }
                                        })
                                    }else {
                                        message(this,res.message,'error');
                                    }
                                }).catch((error)=> {
                                    console.log(error)
                                    this.$store.dispatch('loadingAction',false);
                                });
                            }).catch(() => {
                            });
                        }
                    }else{
                        console.log('error submit!!');
                        return false;
                    }
            })
            }
        },
        created() {
            this.initData()
        },
        mounted() {
        },
        components: {},
        props: {},
        watch: {}
    }
</script>

<style scoped lang="less">
    .add-en{
        .map{
            width: 100%;
            height: 400px;
        }
        
    }
</style>
<style>
    .add-en .el-dialog{
        width: 80%!important
    }
</style>

