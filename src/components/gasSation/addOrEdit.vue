<template>
    <div class="gas-addoredit">
        <el-card class="box-card">
            <el-button type="text" @click="back">返回</el-button>
            <el-form ref="submiteForm" :model="submiteForm" :rules="rules" label-width="140px" style="width:100%margin:0 auto">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="服务城市：" prop="areaCode">
                            <sourceSelect
                                :isDisabled="$route.query.type==='view'"
                                :preloadedSwi="true"
                                :valProp.sync="submiteForm.areaCode"
                                url="/city/city/all"
                                :config="cityConfig" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="加油站品牌" prop="gasBrand">
                            <el-select
                            :disabled="$route.query.type==='view'"
                            clearable
                            v-model="submiteForm.gasBrand"
                            style="width:155px"
                            size="small"
                            placeholder="请选择">
                                <el-option label="中国石化" :value="1"></el-option>
                                <el-option label="中国石油" :value="3"></el-option>
                                <el-option label="中国华信" :value="4"></el-option>
                                <el-option label="中国海油" :value="5"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="加油站名称：" prop="stationName">
                            <el-input  style="width:155px" v-model="submiteForm.stationName" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="营业时间：" prop="businessHour">
                            <el-time-picker
                                value-format="HH:mm:ss"
                                style="width:300px"
                                is-range
                                v-model="submiteForm.businessHour"
                                arrow-control
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20">
                        <el-form-item label="详细地址：" prop="address">
                            <el-input  v-model="submiteForm.address" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="17">
                        <el-form-item label="定位地址：" prop="locationAddress">
                            <el-input disabled v-model="submiteForm.locationAddress" sioooze="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3" style="text-align:right">
                        <el-button size="small" :disabled="$route.query.type==='view'"  type="primary" style="margin-top:3px" @click="showMap">地址定位</el-button>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="20">
                        <el-form-item label="">
                            <div v-if="mapDialog" style="margin:20px 0px">
                                <baidu-map 
                                    :center="center" 
                                    class="map" 
                                    :scroll-wheel-zoom="true" 
                                    @click="markAddress"
                                    :zoom="zoom" 
                                    @ready="handler">
                                    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
                                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>

                                    <bm-local-search :panel="false" :keyword="keyword"  :auto-viewport="true" :location="location" @searchcomplete="searchcomplete"></bm-local-search>
                                    
                                    <bm-marker 
                                    v-if="this.submiteForm.longitude"
                                    :position="{lng: this.submiteForm.longitude, lat: this.submiteForm.latitude}" 
                                    :icon="{url: imgUrl, size: {width: 32,height:32}}"
                                    @dragend="dragend"
                                    :dragging="dragging">
                                        
                                    </bm-marker>
                                </baidu-map>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="当前经度："  prop="latitude">
                            <el-input style="width:155px" v-model="submiteForm.longitude" disabled size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="当前纬度："  prop="longitude">
                            <el-input style="width:155px" v-model="submiteForm.latitude" disabled size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="可用状态：" prop="status">
                            <el-radio-group :disabled="$route.query.type==='view'" v-model="submiteForm.status">
                                <el-radio :label="1">启用</el-radio>
                                <el-radio :label="2">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>


                
                <el-form-item v-if="$route.query.type!=='view'">
                    <el-button type="primary" size="small" :loading="btnLoading" @click="submit('submiteForm')">提交</el-button>
                    <el-button size="small" @click="back">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        
    </div>
</template>

<script>
    import message from '../../assets/js/message'
    import cp from '../../utils/checkPermissions'

    import sourceSelect from '../common/sourceSelect'
    export default {
        components:{
            sourceSelect
        },
        data() {
           
            var checkGasBrand = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('加油站品牌不能为空'))
                }
                callback()
            }
            var checkLatitude = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('经度不能为空'))
                }
                callback()
            }

            var checkLongitude= (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('纬度不能为空'))
                }
                callback()
            }
            var checkBusinessHour= (rule, value, callback) => {
                if (value === '' || value === null) {
                    callback()
                } else {
                    if (Array.isArray(value)) {
                        if (value[0] && value[0] === value[1]) {
                            return callback(new Error('开始时间不能等于结束时间'))
                        } else {
                            callback()
                        }
                    } else{
                        callback()
                    }
                }
            } 
            
            return {
                btnLoading:false,
                geoc: '',
                center: '中国',
                location:'',
                zoom: 3,
                keyword:'',
                imgUrl:'static/img/locked.png',
                mapDialog:false,
                submiteForm:{
                    id:'',
                    areaCode:'',
                    stationName:'',
                    gasBrand:'',
                    businessHour:['',''],
                    locationAddress:'',
                    address:'',
                    latitude:'',
                    longitude:'',
                    status:''
                },
                cityConfig:['baiduid','cityname','data'],
                cityList: [],
                rules: {
                    areaCode:[
                        { required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    stationName:[
                        { required: true,max:60, message: '请输入加油站名称，最多60字符', trigger: 'blur' }
                    ],
                    gasBrand:[
                        { validator:checkGasBrand, trigger: 'change',required: true }
                    ],
                    address:[
                        { required: true,max:120, message: '请输入详细地址，最多120字符', trigger: 'blur' }
                    ],
                    latitude:[
                        { validator: checkLatitude, trigger: 'change' }
                    ],
                    longitude:[
                        { validator: checkLongitude, trigger: 'change' }
                    ],
                    status:[
                        { required: true, message: '请选择状态', trigger: 'change' }
                    ],
                    businessHour:[
                        { trigger: 'change',validator: checkBusinessHour}
                    ]
                },
                dragging: true
            }
        },
        methods: {
            cp,
            initCity () {
                this.$store.dispatch('GetCity').then(res => {
                    this.cityList = res
                })
            },
            initData(){
                if(!(this.$route.query.id)){
                    return
                }
                if (this.$route.query.type === 'view') {
                    this.dragging = false
                }
                this.mapDialog = true
                let req = {
                    id:this.$route.query.id
                }
                this.$store.dispatch('loadingAction',true)
                this.$http.post(`/staff/gasStation/selectById/${req.id}`, req, null, {serveType:1, args: {}, module: 'staff'}).then((response)=> {
                    this.$store.dispatch('loadingAction',false)
                    let res=response.data
                    if(res.errCode == 0){
                        this.submiteForm = res.attachment
                        if(this.submiteForm.price){
                            this.submiteForm.price = this.submiteForm.price/100
                        }
                        this.submiteForm.locationAddress = ''
                        this.submiteForm = _.cloneDeep(this.submiteForm)
                        if (this.submiteForm.businessHour) {
                            this.submiteForm.businessHour = this.submiteForm.businessHour.split('-')
                        }
                        
                        let cityname
                        if (this.submiteForm.areaCode) {
                            this.cityList.forEach(item => {
                                if (item.baiduid == this.submiteForm.areaCode) {
                                    cityname = item.cityname
                                }
                            })
                        }
                        if (cityname) {
                            this.zoom = 10
                        }


                        
                        let ggPoint = new BMap.Point(this.submiteForm.longitude,this.submiteForm.latitude)
                        this.geoc.getLocation(ggPoint, rs => {
                            var addComp = rs.addressComponents
                            if (addComp.province) {
                                this.zoom = 15
                                this.center = {lng:this.submiteForm.longitude,lat:this.submiteForm.latitude}
                                this.submiteForm.locationAddress = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
                               
                            } else {
                                this.submiteForm.locationAddress = ''
                                if (cityname) {
                                    this.zoom = 10
                                    this.center = cityname
                                }
                            }
                            
                        })
                    }else {
                        message(this,res.message,'error')
                    }
                }).catch((error)=> {
                    console.log(error)
                    this.$store.dispatch('loadingAction',false)
                })
            },
            handler ({BMap, map}) {
                let cityname
                if (this.submiteForm.areaCode) {
                    this.cityList.forEach(item => {
                        if (item.baiduid == this.submiteForm.areaCode) {
                            cityname = item.cityname
                        }
                    })
                }
                if (cityname) {
                    this.zoom = 10
                    this.center = cityname
                    // this.location = cityname
                }

                if(this.$route.query.id && this.$route.query.type == 'edit'){
                    this.zoom = 15
                }
                
                this.geoc = new BMap.Geocoder() 
                
            },
            markAddress({type, target, point, pixel, overlay}){
                if (this.$route.query.type === 'view') {
                    return
                }
                this.submiteForm.longitude = point.lng
                this.submiteForm.latitude = point.lat
                
                this.geoc.getLocation(point, rs => {
                    var addComp = rs.addressComponents
                    if (addComp.province) {
                        this.submiteForm.locationAddress = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
                    } else {
                        this.submiteForm.locationAddress = ''
                    }
                })        
            },
            dragend({type, target, pixel, point}){
                this.submiteForm.longitude = point.lng
                this.submiteForm.latitude = point.lat
                this.geoc.getLocation(point, rs => {
                    var addComp = rs.addressComponents
                    if (addComp.province) {
                        this.submiteForm.locationAddress = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
                    } else {
                        this.submiteForm.locationAddress = ''
                    }
                })  
            },
            showMap(){
                this.location = ''
                this.center = '中国'
                let cityname
                if (this.submiteForm.areaCode) {
                    this.cityList.forEach(item => {
                        if (item.baiduid == this.submiteForm.areaCode) {
                            cityname = item.cityname
                        }
                    })
                }
                if (cityname) {
                    this.zoom = 10
                    this.center = cityname
                    // this.location = cityname
                }
                this.keyword = this.submiteForm.address
                if (this.keyword) {
                    this.zoom = 15
                }
                this.mapDialog = true
            },
            searchcomplete(val){
                // console.log(val)
            },
            init(){
                let user = localStorage._MyDaDao_user_data
                if(user){
                    let u = JSON.parse(user)
                    this.submiteForm.user_account = u.user_account
                    this.submiteForm.user_name = u.user_name
                    this.submiteForm.user_id = u.user_id
                    this.submiteForm.user_mobile = u.user_mobile
                    this.submiteForm.user_email = u.user_email
                }
            },
            back(){
                this.$router.push({
                    path:'/gasSation/list'
                })
            },
            submit(formName){
                
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        let data = _.cloneDeep(this.submiteForm)
                        delete data.locationAddress
                        if (data.businessHour === null) {
                            data.businessHour = ''
                        } else {
                            if (data.businessHour[0]) {
                                data.businessHour = data.businessHour.join('-')
                            } else {
                                data.businessHour =''
                            }
                        }
                     
                        this.$confirm('确认提交吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let url
                            if(this.$route.query.type=='add'){
                                url = '/staff/gasStation/add'
                                delete data.id
                            }else{
                                url = '/staff/gasStation/update'
                            }
                            this.btnLoading = true
                         
                            this.$http.post(url, data, null, {serveType:1, args: data, module: 'staff'}).then((response)=> {
                                this.btnLoading = false
                                let res=response.data
                                if(res.errCode == 0){
                                    message(this,res.message,'success')
                                    this.$router.push('/gasSation/list')
                                }else {
                                    message(this,res.message,'error')
                                }
                            }).catch((error)=> {
                                console.log(error)
                                this.btnLoading = false
                            })
                        }).catch(() => {
                        })
                    }else{
                        console.log('error submit!!')
                        return false
                    }
                })
            }
        },
        created() {
            this.initCity()
            this.initData()
        },
        mounted() {
        },
        props: {},
        watch: {}
    }
</script>

<style scoped lang="less">
    .gas-addoredit{
        .map{
            width: 100%;
            height: 400px
        }
        
    }
</style>
<style>
    .gas-addoredit .el-dialog{
        width: 80%!important
    }
</style>

