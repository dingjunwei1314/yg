<template>
    <div class="set-en" style="width:100%">
        <div>
            <el-button size="mini" type="text" @click="$router.push('/city/list')">返回</el-button>
            <el-button size="mini" v-if="cp('--/staff/park/add')"  type="primary" @click="add">增加</el-button>
            <el-button size="mini"   @click="refresh">刷新</el-button>
            

        </div>
        <div class="all-map">
            <el-row>
                <el-col :span="19">
                    <baidu-map 
                        :center="center" 
                        class="map" 
                        :scroll-wheel-zoom="true" 
                        :zoom="zoom" 
                        @ready="handler">
                        <bm-polygon 
                            v-for="(item,index) in polygonPath" 
                            :key="index" 
                            :path="item" 
                            stroke-color="blue" 
                            :stroke-opacity="0.5" 
                            :stroke-weight="2" 
                            :editing="editing" 
                            :massClear="massClear"
                            @lineupdate="updatePolygonPath($event,index)"/>

                        <bm-marker 
                            :massClear="false"
                            v-for="(item,index) in mark" 
                            :key="index" 
                            :position="{lng: item.longitude, lat: item.latitude}">
                        </bm-marker>
                    </baidu-map>
                    <el-button size="mini" :disabled="choceIndex===null"  type="primary" style="margin-top:10px" @click="editing=!editing">
                        <span v-if="!editing">开启围栏编辑功能</span> 
                        <span v-else>关闭围栏编辑功能</span>        
                    </el-button>
                    <el-button 
                        size="mini" 
                        :disabled="choceIndex===null || polygonPath[0] == undefined" 
                        type="danger" 
                        v-if="cp('--/staff/parkFence/delete')"
                        @click="clearAll">清除本网点所有覆盖物</el-button>
                    <p style="margin-top:10px;color:#444">
                        使用说明:先从右侧列表选择要规划的网点，地图右上角是新增规划电子围栏的工具,地图下面的工具栏可以对已规划好的电子围栏进行编辑操作。(注意：一个网点只能对应规划一个电子围栏！)
                    </p>
                </el-col>
                <el-col :span="5" class="en-list">
                    <p style="color:#444">围栏列表：</p>
                    <span  v-if="attachment.length<=0">暂无数据</span>
                    <el-row 
                        style="padding:10px;border-bottom:1px solid #ddd" 
                        :key="index"
                        v-for="(item,index) in attachment">
                        <div>
                            <el-button 
                                class="name-btn"
                                :class="{'activeClass':choceIndex===index}" 
                                size="mini"  
                                type="text" 
                                @click="choceEn(index,item)">
                                {{item.locationName}}
                            </el-button>
                            <p>类型：
                                <span v-if="item.parkLevel=='3'">报警围栏</span>
                                <span v-else>核心服务区围栏</span>
                            </p>
                        </div>

                        <el-button 
                            style="margin-left:10px;margin-bottom:2px"
                            size="mini" 
                            v-if="cp('--/staff/parkFence/addOrUpdate')"
                            :disabled="polygonPath[0]==undefined" 
                            v-show="choceIndex===index"  
                            type="primary" 
                            @click="saveEn(index,item)">
                            保存
                        </el-button>

                        <el-button 
                            style="margin-bottom:2px"
                            size="mini" 
                            v-if="cp('--/staff/park/update-fence')"
                            v-show="choceIndex===index"  
                            type="primary" 
                            @click="editEn(index,item)">
                            修改
                        </el-button>

                        <el-button 
                            size="mini" 
                            v-if="cp('--/staff/park/updateStatus')"
                            v-show="choceIndex===index" 
                            type="warning" 
                            @click="forbiddenEn(index,item)">
                            <span v-if="item.status == 20">启用</span>
                            <span v-if="item.status == 10">禁用</span>
                        </el-button>

                        <el-button 
                            size="mini" 
                            v-if="cp('--/staff/parkFence/delete')"
                            
                            v-show="choceIndex===index" 
                            type="danger" 
                            @click="deleteEn(index,item)">
                            删除
                        </el-button>

                    </el-row>
                </el-col>
            </el-row>  
        </div>
    </div>
</template>


<script>
    import message from '../../assets/js/message';
    import cp from '../../utils/checkPermissions'
    import index from '../../api/select';
    export default {
        components:{
            
        },
        data() {

            return {
                center: {lng: 0, lat: 0},
                zoom: 10,
                choceIndex:null,
                baiduid:this.$route.query.baiduid,
                attachment:[],
                status:'',
                drawingManager:null,
                styleOptions:null,
                map:null,
                editing:false,
                massClear:false,
                allMark:[],
                mark:[
                   
                ],
                polygonPath:[
                   
                ],
                addUpdataForm:{
                    parkId:'',
                    fenceId:'',
                    fenceList:[]
                }
               
            }
        },
        created(){
            this.initEn()
        },
        mounted() {
            
        },
        methods: {
            cp,
            add(){
                this.$router.push({
                    path:'/city/addenclosure',
                    query:{
                        cityname:this.$route.query.cityname,
                        baiduid:this.$route.query.baiduid
                    }
                })
            },
            refresh(){
                this.initEn();
                this.choceIndex = null;
                this.polygonPath = [];
                this.drawingManager.close();
                this.editing = false;
            },
            handler ({BMap, map}) {
                let _this = this;
                this.center = this.$route.query.cityname;
                this.zoom = 11
                this.map = map;
                if(this.$route.query.cityname){
                    this.location = this.$route.query.cityname
                }

                _this.styleOptions = {
                    strokeColor:"red",    //边线颜色。
                    fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 3,       //边线的宽度，以像素为单位。
                    strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                    strokeStyle: 'solid' //边线的样式，solid或dashed。
                }
                    //实例化鼠标绘制工具
                this.drawingManager = new BMapLib.DrawingManager(map, {
                    isOpen: true, //是否开启绘制模式
                    enableDrawingTool: true, //是否显示工具栏
                    drawingType:BMAP_DRAWING_POLYGON,
                    drawingToolOptions: {
                        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                        offset: new BMap.Size(5, 5), //偏离值
                        drawingModes : [
                            // BMAP_DRAWING_MARKER,
                            // BMAP_DRAWING_CIRCLE,
                            // BMAP_DRAWING_POLYLINE,
                            BMAP_DRAWING_POLYGON,
                            // BMAP_DRAWING_RECTANGLE 
                        ]
                    },
                    circleOptions: _this.styleOptions, //圆的样式
                    polylineOptions: _this.styleOptions, //线的样式
                    polygonOptions: _this.styleOptions, //多边形的样式
                    rectangleOptions: _this.styleOptions //矩形的样式
                });  

                this.drawingManager.addEventListener('overlaycomplete', overlaycomplete);
                this.drawingManager.close();
            

                function overlaycomplete(e,overlay){
                    _this.map.clearOverlays()
                    if(_this.polygonPath.length <= 0){
                        _this.polygonPath.push(e.overlay.getPath())
                    }else{
                        message(_this,'一个网点只能添加一个围栏','error');
                    }
                    
                    if(_this.choceIndex == null){
                        _this.polygonPath = [];
                        message(_this,'请先选择网点,再进行编辑操作','error');
                    }

                    // if(_this.status == 20){
                    //     _this.polygonPath = [];
                    //     message(_this,'禁用的围栏无法进行编辑操作','error');
                    // }
                    
                };
            },
            updatePolygonPath(e,index){
                this.polygonPath[index] = e.target.getPath();
            },
            clearAll(){
                this.$confirm('确认清除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let req = { 
                        fenceId:this.addUpdataForm.fenceId,
                        parkId:this.addUpdataForm.parkId,
                        type:0
                    }
                    if(req.fenceId == ''){
                        req.fenceId = 0
                    }
                    this.$http.post('/staff/parkFence/delete',req,{type:'payload'}).then((response) => {
                        var res = response.data;
                        if (res.errCode == 0) {
                            message(this,res.message,'success');
                            this.initEn()
                            this.choceIndex = null
                            this.polygonPath = []
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch(() => {
                });
            },
            initEn(){
                let req = {
                    areaCode:this.baiduid,
                    status:0,
                    parkLevel:5
                }
                this.$store.dispatch('loadingAction',true);
                this.$http.post('/staff/park/find', req).then((response)=> {
                    this.$store.dispatch('loadingAction',false);
                   var res = response.data;
                   if(res.errCode === 0){
                       this.attachment = res.attachment;
                       this.mark = res.attachment;
                       this.allMark = res.attachment;
                   }else {
                       message(this,res.message,'error')
                   }
                }).catch((error)=> {
                    console.log(error)
                    this.$store.dispatch('loadingAction',false);
                });
            },
            choceEn(index,item){
                let req = {
                    parkId:item.id,
                }
                this.polygonPath = [];
                this.addUpdataForm.fenceId = '';
                this.addUpdataForm.fenceList = [];
                this.addUpdataForm.parkId = '';
                this.editing = false;
                this.drawingManager.close();
                this.status = item.status;

               
                this.$store.dispatch('loadingAction',true);
                this.$http.post('/staff/parkFence/findByPark',req,{type:'payload'}).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                    if (res.errCode == 0) {
                        this.choceIndex = index;
                
                        this.mark = [ {longitude: item.longitude, latitude: item.latitude}];
                        this.center = {lng:item.longitude,lat:item.latitude}
                        this.addUpdataForm.parkId = item.id;
                        
                        if(res.attachment[0]){
                            if (res.attachment[0].fenceRange === null || res.attachment[0].fenceRange === []) {
                                this.polygonPath[0] = []
                            } else {
                                this.polygonPath[0] = JSON.parse(res.attachment[0].fenceRange);
                            }
                            this.addUpdataForm.fenceId = res.attachment[0].id;
                        }
                        // console.log(this.addUpdataForm)
                    } else {
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('loadingAction',false);
                })
            },
            saveEn(index,item){
                this.$confirm('确认保存吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   
                    this.addUpdataForm.fenceList = this.polygonPath[0];
                    let req = _.cloneDeep(this.addUpdataForm);
                    req.fenceList = JSON.stringify(req.fenceList);
                    this.$store.dispatch('loadingAction',true)
                    this.$http.post('/staff/parkFence/addOrUpdate',req,{type:'payload'}).then((response) => {
                        this.$store.dispatch('loadingAction',false)
                        var res = response.data;
                        if (res.errCode == 0) {
                            message(this,res.message,'success')
                            this.choceEn(index,item)
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch(() => {
                    this.$store.dispatch('loadingAction',false)
                });
            },
            editEn (index, item) {
                this.$router.push({
                    path:'/city/addenclosure',
                    query:{
                        cityname:this.$route.query.cityname,
                        baiduid:this.$route.query.baiduid,
                        id: item.id,
                        type: 'edit'
                    }
                })
            },
            forbiddenEn(index,item){
                let str1,str2,req = {};
                req.id = item.id;
                req.areaCode = this.$route.query.baiduid;
                if(item.status == 10){
                    str1 = '确认禁用吗？';
                    req.status = 2;
                }else{
                    str1 = '确认启用吗？'
                    req.status = 1;
                }
                this.$confirm(str1, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('loadingAction',true)
                    this.$http.post('/staff/park/updateStatus',req,{type:'payload'}).then((response) => {
                        this.$store.dispatch('loadingAction',false)
                        var res = response.data;
                        if (res.errCode == 0) {
                            message(this,res.message,'success')
                            this.initEn()
                            this.choceIndex = null
                            this.polygonPath = []
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch(() => {
                    this.$store.dispatch('loadingAction',false)
                });
            },
            deleteEn(index,item){
                this.$confirm('确认删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let req = { 
                        fenceId:this.addUpdataForm.fenceId,
                        parkId:this.addUpdataForm.parkId,
                        type:1
                    }
                    if(req.fenceId == ''){
                        req.fenceId = 0
                    }
                    this.$store.dispatch('loadingAction',true)
                    this.$http.post('/staff/parkFence/delete',req,{type:'payload'}).then((response) => {
                        this.$store.dispatch('loadingAction',false)
                        var res = response.data;
                        if (res.errCode == 0) {
                            message(this,res.message,'success')
                            // this.choceEn(index,item)
                            this.initEn()
                            this.choceIndex = null
                            this.polygonPath = []
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch(() => {
                    this.$store.dispatch('loadingAction',false)
                });
            }
        },
        props: {},
        watch: {}
    }
</script>
<style lang="less">
    .set-en{
        .map{
            width: 100%;
            height: 800px;
        }
        .en-list{
            height:800px;
            overflow-y:auto;
            overflow-x: hidden;

        }
        .all-map{
            background: white;
            padding: 10px;
            margin-top: 20px;
            .name-btn{
                white-space:normal;
                text-align: left
            }
        }
        .activeClass{
            color: red
        }
        @media screen and (max-width: 1300px) {
            .map{
                width: 100%;
                height: 400px;
            }
            .en-list{
                height:400px;
                overflow-y:auto
            }
        }
        
    }
</style>
