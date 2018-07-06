<template>
    <div class="park-list">
        <div style="margin-bottom: 20px" >
            <el-button size="mini" type="text" v-show="!isShowFilterForm" @click="filterFormSwitch(true)">展开</el-button>
        </div>
        <el-row class="filter-form" v-show="isShowFilterForm">
            <el-row>
                <el-button size="text" style="font-size:12px;" @click="filterFormSwitch(false)">隐藏</el-button>
            </el-row>
            <el-col :span="19" class="search-form">
                <el-form :model="filterForm" :inline="true" label-width="100px">
                    <el-form-item label="车牌号">
                        <el-input v-model="filterForm.license_tag" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="地服姓名">
                        <el-input v-model="filterForm.full_name" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="工单编号">
                        <el-input v-model="filterForm.order_num" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="账号">
                        <el-input v-model="filterForm.phone_num" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="所属地服供应商">
                        <sourceSelect 
                            :valProp.sync="filterForm.user_company_id"
                            url="/ground/staff/ground-service-all"
                            :config="cConfig" />
                    </el-form-item>
                    <el-form-item label="工单状态">
                        <el-select 
                        clearable 
                        v-model="filterForm.status" 
                        style="width:155px" 
                        size="small" 
                        placeholder="请选择">
                            <el-option label="已发未接" value="0"></el-option>
                            <el-option label="进行中" value="10"></el-option>
                            <el-option label="已完成" value="15"></el-option>
                            <el-option label="已取消" value="20"></el-option>
                            <el-option label="已撤销" value="30"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务城市">
                        <sourceSelect 
                            :valProp.sync="filterForm.area_code"
                            url="/city/city/all"
                            :config="cityConfig" />
                    </el-form-item>
                    <el-form-item label="停车费提交时间" label-width="100px">
                        <el-date-picker
                            size="small"
                            value-format="timestamp"
                            style="width:350px"
                            v-model="filterForm.create_time"
                            type="datetimerange"
                            align="right"
                            :default-time="['00:00:00', '23:59:59']"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="接单时间" label-width="100px">
                        <el-date-picker
                            size="small"
                            :default-time="['00:00:00', '23:59:59']"
                            value-format="timestamp"
                            style="width:350px"
                            v-model="filterForm.receive_time"
                            type="datetimerange"
                            align="right"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="5">
                <el-button size="small" type="primary" @click="search(true)">搜索</el-button>
                <el-button size="small" @click="search(false)">重置</el-button>
                <el-button size="small" @click="refresh">刷新</el-button>
            </el-col>
        </el-row>
        <div>
            <el-button size="mini" type="primary" v-if="cp('--/work/park/export')" @click="exportExel(1)">导出当前列表</el-button>

            <el-button size="mini" type="primary" v-if="cp('--/work/park/exports')" @click="exportExel(2)">导出全部列表</el-button>
            <el-table 
                :data="tableData"
                :default-sort="{prop: 'id', order: 'descending'}"
                @sort-change="sortChange"
                border
                v-loading="loading"
                style="width: 100%;margin-top:20px;">
                <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" v-if="cp('--/park/work/order/view')" @click="view(scope.row.id)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                
                    label="ID"
                    prop="id">
                </el-table-column>
                <el-table-column
                    
                    label="地服手机号/账号"
                    prop="phone_num">
                </el-table-column>
                <el-table-column
                    
                    label="地服姓名"
                    prop="full_name">
                </el-table-column>
                <el-table-column
                    
                    label="工单号"
                    prop="order_num">
                </el-table-column>
                <el-table-column
                    label="地服所属地服供应商"
                    prop="user_company_id">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="工单状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==0">已发未接</span>
                        <span v-if="scope.row.status==10">进行中</span>
                        <span v-if="scope.row.status==15">已完成</span>
                        <span v-if="scope.row.status==20">已取消</span>
                        <span v-if="scope.row.status==30">已撤销</span>
                    </template>
                </el-table-column>
                <el-table-column   
                    
                    label="车牌号"
                    prop="license_tag">
                </el-table-column>
                <el-table-column
                    sortable="custom"
                    prop="receive_time"
                    label="接单时间">
                </el-table-column>
                <el-table-column
                    sortable="custom"
                    prop="creat_time"
                    label="停车费提交时间">
                </el-table-column>
                <el-table-column
                
                    label="停车时长(分)">
                    <template slot-scope="scope">
                        <span>{{scope.row.park_time ? parseInt(scope.row.park_time/60):''}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    
                    prop="fee"
                    label="停车费(元)">
                    <template slot-scope="scope">
                        <span>{{parseInt(scope.row.fee/100)}}</span>
                    </template>
                </el-table-column>
                
            </el-table>
        </div>
        <div style="text-align:center;margin-top:30px">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="page"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <!--查看-->
        <el-dialog title="查看工单" :close-on-press-escape="false" :visible.sync="viewDialog">
            <p class="tag-lab">工单信息</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
                <el-form class="view-con" :label-width="'120px'" :inline="true">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工单编号：">
                                <span>{{orderData.work.order_num}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="对应订单：">
                                <span>{{orderData.work.order_num}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工单状态：">
                                <span>{{orderStatus[orderData.work.status]}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="下单人员：">
                                <span>{{orderData.work.create_user_id}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="工单创建时间：">
                                <span>{{orderData.work.create_time}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="派单方式：">
                                <span>{{disType[orderData.work.distribute_type]}}</span>
                            </el-form-item>
                        </el-col>   
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="接单时间：">
                                <span>{{orderData.work.receive_time}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="完成时间：">
                                <span>{{orderData.work.finish_time}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="接单人员：">
                                <span>{{orderData.work.name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="地服手机号：">
                                <span>{{orderData.work.phone_num}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="地服所属供应商：">
                                <span>{{orderData.work.full_name}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="开门检查：">
                                <span>{{orderData.work.car_status_type}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="开门检车备注：">
                                <span>{{orderData.work.remark}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                    <el-col :span="12">
                        <el-form-item label="行驶里程(km)：">
                            <span>
                              {{orderData.work.travel_mileage? (orderData.work.travel_mileage/1000).toFixed(2):''}}
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="导航行驶里程(km)：">
                            <span>
                              {{orderData.work.navigation_mileage? (orderData.work.navigation_mileage/1000).toFixed(2):''}}
                            </span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="行驶时长(分)：">
                            <span>
                              {{orderData.work.travel_time? (orderData.work.travel_time/60).toFixed(2):''}}
                            </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="导航行驶时长(分)：">
                            <span>
                              {{orderData.work.navigation_time? (orderData.work.navigation_time/60).toFixed(2):''}}
                            </span>
                        </el-form-item>
                    </el-col>
                </el-row>
                </el-form>
            </el-row>
            <p class="tag-lab">车辆信息</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
                <el-table 
                :data="[orderData.car]"
                border
                >
                    <el-table-column
                        label="车辆型号"
                        prop="brand">
                    </el-table-column>
                    <el-table-column
                        label="能耗类型"
                        prop="energyType">
                        <template slot-scope="scope">
                            <span>{{types[scope.row.energyType]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="车牌号"
                        prop="license_tag">  
                    </el-table-column>
                    <el-table-column
                        label="取车时位置"
                        prop="quche_address">
                    </el-table-column>
                    <el-table-column
                        label="关单时位置"
                        prop="huanche_address">
                    </el-table-column>
                
                    <el-table-column
                        label="接单时剩余电量/油量（L）"
                        prop="start_electricty">
                    </el-table-column>
                    <el-table-column
                        prop="end_electricty"
                        label="关单时剩余电量/油量（L）">
                    </el-table-column>
                </el-table>
            </el-row>
            <p class="tag-lab">任务信息</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
                <el-form  :inline="true">
                    <el-form-item label="任务类型：">
                        <span>{{orderData.task.task_types}}</span>
                    </el-form-item>
                    <el-form-item label="任务描述：">
                        <span>{{orderData.task.instruction}}</span>
                    </el-form-item>
                </el-form>
            </el-row>
            <p class="tag-lab">开门检查照片</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
              
                <div id="workerPreOpen">
                <picpreview v-for="item in orderData.open_img" :backgroundPicUrl="picUrl+item" :key="item" />
                </div>
            </el-row>
            <p class="tag-lab">完成任务照片</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
              
                <div id="workerPreClose">
                    <picpreview v-for="item in orderData.close_img" :backgroundPicUrl="picUrl+item" :key="item" />
                </div>
            </el-row>
            
            <p class="tag-lab">备注</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
            <el-form  :inline="true">
              <el-form-item label="后台操作人：">
                  <span>{{orderData.work.operator_name}}</span>
              </el-form-item>
              <el-form-item label="后台账号：">
                  <span>{{orderData.work.operator_account}}</span>
              </el-form-item>
          </el-form>
            <span>{{orderData.message}}</span>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import qs from 'qs'
    import message from '../../assets/js/message';
    import sourceSelect from '../common/sourceSelect';
    import {getComData} from '../../api/parkList';
    import {DOWN_URL,picUrl} from '../../config/app';
    import picpreview from '../common/picpreview';

    import cp from '../../utils/checkPermissions';
    import exportExcel from '../../assets/js/exportExcel';
    export default {
        components:{
            sourceSelect,
            picpreview
        },
        data() {
            return {
                picUrl,
                page: 1,//当前也
                total:0,//总数
                tableData: [],//列表数据
                loading:false,
                reqUrl:'/work/park/list',
                viewDialog:false,
                where:'',
                cConfig:['id','full_name','data'],
                cityConfig:['baiduid','cityname','data'],
                
                comList:[],
                cityList:[],
                types:{},
                taskTypes:[],
                orderStatus:{},
                disType:{},
                wokerList:[],
                carStatus:{},

                filterForm:{
                    page:1,
                    pageSize:10,
                    license_tag:'',
                    full_name:'',
                    phone_num:'',
                    order_num:'',
                    user_company_id:'',
                    create_time:[],
                    status:'',
                    area_code:'',
                    receive_time:[]
                },
                isShowFilterForm:true,

                role_id:'',
                orderData:{
                    car:{},
                    work:{},
                    task:{},
                    price:{},
                    message:'',
                    open_img:'',
                    close_img:''
                },
                viewDialog:false,
                editDialog:false,
                sorts:''
            }
        },
        created(){
            this.getRoleId();
            this.initWokerList();
            this.initTaskTypes();
            this.initType();
            this.initDisType();
            this.getComDataHandle();
            this.initCity();
            this.initOrderStatus();
            this.initCarStatus();
        },
        mounted() {
            this.getListData();
        },
        filters:{
           
        },
        methods: {
            cp,
            //获取当前用户id
            getRoleId(){
                let user = localStorage._MyDaDao_user_data;
                if(user){
                     this.role_id = JSON.parse(user).role_id;
                }
            },
            // 获取下单人员列表
            initWokerList(){
                this.$http.post('/access/account/all').then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.wokerList = res.data;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            //获取引擎类型
            initType(){
                this.$http.post('/work/order/energy-type').then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.types = res.data;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            //获取车辆状态
            initCarStatus(){
                this.$http.post('/work/order/car-status').then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.carStatus = res.data;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            //获取全部工单状态
            initOrderStatus(){
                this.$http.post('/work/order/work-status').then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.orderStatus = res.data;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            handleData(){
                this.tableData.forEach(item => {
                    let cityArr = [],taskArr = [];
                    this.comList.forEach(item2 => {
                        if(item.user_company_id == item2.id){
                            item.user_company_id = item2.full_name;
                        }
                        if(item.car_company_id == item2.id){
                            item.car_company_id = item2.full_name;
                        }
                    });
                    if(item.area_code){
                        item.area_code.split(',').forEach( codeItem => {
                            this.cityList.forEach(item3 => {
                                if(codeItem == item3.baiduid){
                                    cityArr.push(item3.cityname)
                                }
                            })
                        })
                        item.area_code = _.cloneDeep(cityArr)
                    }
                    if(item.task_types){
                        item.task_types.slice(1,-1).split(',').forEach( typeItem => {
                            this.taskTypes.forEach(item4 => {
                                if(typeItem == item4.code){
                                    taskArr.push(item4.name)
                                }
                            })
                        })
                        item.task_types = _.cloneDeep(taskArr)
                    }

            
    
                })
            },
                  //获取城市列表
            initCity(){
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
            //获取配发方式
            initDisType(){
                this.$http.post('/work/order/work-distribute-type').then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.disType = res.data;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            //获取任务类型
            initTaskTypes(){
                this.$http.post('/ground/staff/order-type-all').then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.taskTypes = res.data;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            getComDataHandle(){
                getComData().then(res => {
                    if(res.code === 200){
                        this.comList = res.data;
                    }else{
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            //sort-change
            sortChange(res){
                if(res.prop){
                this.sorts= res.prop+'&'+res.order.split('ending')[0];
                }else {
                this.sorts=''
                }
                this.filterForm.page = 1;
                this.page = 1;
                this.getListData();
            },
            //获取数据
            getListData() {
                this.$store.dispatch('loadingAction',true);
                let data = {},copyData = _.cloneDeep(this.filterForm);
                data.page = this.filterForm.page;
                data.pageSize = this.filterForm.pageSize;
                
                if(this.sorts){
                    data.sort = this.sorts;
                }else{
                    data.sort = 'id&desc'
                }

                delete copyData.page;
                delete copyData.pageSize;
               
                
                if(copyData.create_time!=null && copyData.create_time[0]){
                    copyData.create_time = copyData.create_time[0]/1000+'--'+copyData.create_time[1]/1000;
                }else{
                    copyData.create_time = '';
                }

                if(copyData.receive_time!=null && copyData.receive_time[0]){
                    copyData.receive_time = copyData.receive_time[0]/1000+'--'+copyData.receive_time[1]/1000;
                }else{
                    copyData.receive_time = ''
                }
                
                data.where = qs.stringify(copyData);
                this.where = qs.stringify(copyData);
                this.$http.post(this.reqUrl,data,).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                    if (res.code === 200) {
                        this.tableData = res.data.data;
                        this.total = parseInt(res.data.total);
                        this.tableData.forEach(item => {
                            this.comList.forEach(item2 => {
                                if(item.user_company_id == item2.id){
                                    item.user_company_id = item2.full_name;
                                }
                            })
                        })
                    }else {
                        this.tableData=[];
                        this.page=1;
                    }
                }).catch(err => {
                    console.log(err);
                    this.$store.dispatch('loadingAction',false);
                })
            },
            //切换分页
            handleCurrentChange(val) {
                this.page=val;
                this.filterForm.page = val;
                this.getListData();
            },
            //展开隐藏搜索
            filterFormSwitch(swi){
                this.isShowFilterForm = swi;
            },
            //搜索与重置
            search(swi){
                if(swi){
                    this.filterForm.page = 1;
                    this.page = 1;
                    this.getListData();
                }else{
                    for(let i in this.filterForm){
                        if(i != 'pageSize' && i != 'page'){
                            this.filterForm[i] = ''
                        }
                    }
                }
            },
            //刷新
            refresh(){
                for(let i in this.filterForm){
                    if(i != 'pageSize' && i != 'page'){
                        this.filterForm[i] = ''
                    }
                }
                this.filterForm.page = 1;
                this.page = 1;
                this.getListData();
            },
            view(id){
                this.viewDialog = true;
                this.$http.post('/work/order/view',{id}).then((response)=>{
                    var res = response.data;
                    if(res.code === 200){
                        let taskArr = [];
                        this.orderData = res.data;
                        this.wokerList.forEach(item => {
                            if(item.user_id == this.orderData.work.create_user_id){
                                this.orderData.work.create_user_id = item.user_name
                            }
                        })

                        if(this.orderData.close_img){
                            this.orderData.close_img = JSON.parse(this.orderData.close_img);
                            this.orderData.close_img = Object.values(this.orderData.close_img);
                        }
                        
                        if(this.orderData.open_img){
                            this.orderData.open_img = JSON.parse(this.orderData.open_img);
                            this.orderData.open_img = Object.values(this.orderData.open_img);
                        }

                        setTimeout(() => {
                            var closeViewer = new Viewer(document.getElementById('workerPreClose'), {
                            url: 'data-original'
                            });
                            var openViewer = new Viewer(document.getElementById('workerPreOpen'), {
                            url: 'data-original'
                            });
                        },1000)

                        if(this.orderData.task.task_types){
                            this.orderData.task.task_types.slice(1,-1).split(',').forEach( typeItem => {
                                this.taskTypes.forEach(item4 => {
                                    if(typeItem == item4.code){
                                        taskArr.push(item4.name)
                                    }
                                })
                            })
                            this.orderData.task.task_types = _.cloneDeep(taskArr).join(',')
                        }
                       
                    }
                }) 
            },
            //导出
            exportExel(type){
                let url = '',req;
                if(type == 1){
                    url = '/work/park/export';
                    req = {role_id:this.role_id,where:this.where}
                }else{
                    url = '/work/park/exports';
                    req = {role_id:this.role_id}
                }
                this.$store.dispatch('loadingAction', true);
                this.$http.post(url,req,{type:'payload'}).then((response) => {
                    this.$store.dispatch('loadingAction', false);
                    let res = response.data;
                    if(res.code == 200){
                        if(res.data.data.length===0){
                            message(this,'无可导出数据','error')
                        }else{
                            let props=['ID','phone_num','full_name','user_company','order_num','status_name','license_tag','receive_time','creat_time','park_time','fee'];
                            exportExcel('停车费列表',res.data.title,props,res.data.data);
                        }
                    }else{
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('loadingAction', false);
                })
            }
        },
        props: {},
        watch: {}
    }
</script>
<style lang="less">
    .park-list {
        .search-form .el-form--inline .el-form-item__label{
            text-align: right
        }
        .el-form-item__content>div{
            width: 80%;
        }
        .el-form-item__content .el-button{
            width: 80%;
        }

    }

    .park-list .filter-form{
        background: white;
        padding: 10px;
        margin-bottom: 20px;
    }

    .el-form--inline .el-form-item__label{
        text-align: left
    }
    .el-dialog{
        width: 70%;
    }
    .el-checkbox+.el-checkbox{
        margin-left: 0px;
        margin-right: 10px
    }
    .el-checkbox{
        margin-right: 10px
    }
    .tag-lab{
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: white;
        background-color: #3c8dbc;
        margin-bottom: 0px;
    }
    .view-con .el-form-item{
        // margin-bottom: 0px
    }
</style>
