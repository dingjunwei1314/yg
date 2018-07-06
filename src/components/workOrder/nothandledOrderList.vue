<template>
    <div class="nothandled-order">
        <div style="margin-bottom: 20px" >
            <el-button size="mini" type="text" v-show="!isShowFilterForm" @click="filterFormSwitch(true)">展开</el-button>
        </div>
        <el-row class="filter-form" v-show="isShowFilterForm">
            <el-row>
                <el-button size="text" style="font-size:12px;" @click="filterFormSwitch(false)">隐藏</el-button>
            </el-row>
            <el-col :span="18" class="search-form">
                <el-form :model="filterForm" :inline="true" label-width="100px">
                    <el-form-item label="车牌号">
                        <el-input v-model="filterForm.license_tag" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="工单编号">
                        <el-input v-model="filterForm.order_num" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="下单人员">
                        <sourceSelect 
                            :valProp.sync="filterForm.create_user_id"
                            url="/access/account/all"
                            :config="aConfig" />
                    </el-form-item>
                    <el-form-item label="能耗类型">
                        <el-select 
                        clearable 
                        v-model="filterForm.type" 
                        style="width:155px" 
                        size="small" 
                        placeholder="请选择">
                            <el-option v-for="(v,k) in types" :key="k" :label="v" :value="k"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务城市">
                        <sourceSelect 
                            :valProp.sync="filterForm.area_code"
                            url="/city/city/all"
                            :config="cityConfig" />
                    </el-form-item>
                    <el-form-item label="地服所属供应商">
                        <sourceSelect 
                            :valProp.sync="filterForm.user_company_id"
                            url="/ground/staff/ground-service-all"
                            :config="cConfig" />
                    </el-form-item>
                    <el-form-item label="业务类型">
                        <sourceSelect 
                            :valProp.sync="filterForm.task_types"
                            url="/ground/staff/order-type-all"
                            :config="oConfig" />
                    </el-form-item>
                    <el-form-item label="下单时间" label-width="100px">
                        <el-date-picker
                            size="small"
                            :default-time="['00:00:00', '23:59:59']"
                            value-format="timestamp"
                            style="width:350px"
                            v-model="filterForm.create_time"
                            type="datetimerange"
                            align="right"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            >
                        </el-date-picker>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <el-button size="small" type="primary" @click="search(true)">搜索</el-button>
                <el-button size="small" @click="search(false)">重置</el-button>
                <el-button size="small" @click="refresh">刷新</el-button>
            </el-col>
        </el-row>
        <div>
            <el-button size="mini" v-if="cp('--/work/abnormal/doing/export')" type="primary" @click="exportExel(1)">导出当前列表</el-button>

            <el-button size="mini" v-if="cp('--/work/abnormal/doing/exports')" type="primary" @click="exportExel(2)">导出全部列表</el-button>

            <el-table 
                :data="tableData"
                :default-sort="{prop: 'id', order: 'descending'}"
                @sort-change="sortChange"
                border
                v-loading="loading"
                style="width: 100%;margin-top:20px;">
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" style="margin-bottom:10px" v-if="cp('--/n/staff/staff-order/view')" type="primary" @click="view(scope.row.id)">查看</el-button>

                        <el-button size="mini" style="margin-left:0px;margin-bottom:10px" v-if="cp('--/n/staff/staff-order/update')" type="warning" @click="edit(scope.row)">修改</el-button>

                        <el-button size="mini" style="margin-left:0px;margin-bottom:10px" v-if="cp('--/n/staff/staff-order/remark')" type="danger" @click="dele(scope.row)">撤销</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="ID"
                    prop="id">
                </el-table-column>
                <el-table-column
                    label="城市"
                    prop="area_code">
                </el-table-column>
                <el-table-column
                    label="工单号"
                    prop="order_num">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="工单状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='0'">已发未接</span>
                        <span v-if="scope.row.status=='10'">进行中</span>
                        <span v-if="scope.row.status=='15'">已完成</span>
                        <span v-if="scope.row.status=='20'">已取消</span>
                        <span v-if="scope.row.status=='30'">已撤销</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="task_types"
                    label="任务类型">
                </el-table-column>
                <el-table-column
                    prop="brand"
                    label="车型">
                </el-table-column>
                <el-table-column
                    label="车牌号"
                    prop="license_tag">
                </el-table-column>
                <el-table-column
                    sortable="custom"
                    prop="create_time"
                    label="下单时间">
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
        <el-dialog title="查看工单" :visible.sync="viewDialog">
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
                            <el-form-item label="工单积分：">
                                <span>
                                {{orderData.work.staff_task_price}}
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="开门检查：">
                                <span>{{orderData.work.car_status_type}}</span>
                            </el-form-item>
                        </el-col>
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
        <!-- 修改 -->
        <el-dialog title="查看工单" :close-on-press-escape="false" :visible.sync="editDialog">
            <p class="tag-lab">车辆信息</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
                <el-table 
                :data="[editData.car]"
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
                        label="车辆状态"
                        prop="status">
                        <template slot-scope="scope">
                            <span>{{carStatus[scope.row.status]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="车辆位置"
                        prop="location_name">
                    </el-table-column>
                    <el-table-column
                        label="剩余电量/油量"
                        prop="electricty">
                    </el-table-column>
                    <el-table-column
                        prop="mileage"
                        label="剩余行驶里程(km)">
                    </el-table-column>
                </el-table>
            </el-row>
            <p class="tag-lab">任务信息</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
                <el-form >
                <el-form-item label="派单方式：">
                    <el-select 
                     
                    v-model="editForm.workOrder.distributeType" 
                    style="width:155px" 
                    size="small" 
                    placeholder="请选择">
                        <el-option label="专单" value="1"></el-option>
                        <el-option label="接单" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务类型：">
                   
                    <el-select 
                    clearable 
                    v-model="editForm.workOrder.taskList[0].taskType" 
                    style="width:155px" 
                    size="small" 
                    placeholder="请选择">
                        <el-option v-for="item in taskTypes" :label="item.name" :value="item.code" :key="item.code"></el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="地服人员：" v-show="editForm.workOrder.distributeType=='1'">
                    <staffUserList :valProp.sync="editForm.workOrder.userId"></staffUserList>
                </el-form-item>
              
                <el-form-item label="任务描述：">
                    <el-input v-model="editForm.workOrder.instruction" type="textarea" size="small"></el-input>
                </el-form-item>
                
                <div style="text-align:center;margin-top:30px">
                    <el-button style="width:80px;" size="mini" type="primary"  @click="editFinish">提交</el-button>
                </div>
            </el-form>
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
    import staffUserList from '../common/select/staffUserList'
    export default {
        components:{
            sourceSelect,
            picpreview,
            staffUserList
        },
        data() {
            return {
                picUrl,
                page: 1,//当前也
                total:0,//总数
                tableData: [],//列表数据
                loading:false,
                reqUrl:'/work/abnormal/doing/list',
                viewDialog:false,
                editDialog:false,
                where:'',
                cConfig:['id','full_name','data'],
                cityConfig:['baiduid','cityname','data'],
                oConfig:['code','name','data'],
                aConfig:['user_id','user_name','data'],
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
                    create_user_id:'',
                    license_tag:'',
                    order_num:'',
                    user_company_id:'',
                    car_company_id:'',
                    create_time:[],
                    type:'',
                    task_types:'',
                    area_code:'',
                },
                editData:{
                    car:{}
                },

                editForm:{
                    workOrder:{
                        workOrderId:'',
                        createUserId:'',
                        carId:'',
                        userId:'',
                        businessType:1,
                        workType:1,
                        instruction:'',
                        isOnline:1,
                        distributeType:'',
                        source:1,
                        taskList:[
                        {
                            taskId:'',
                            taskType:'',
                            instruction:''
                        }
                        ]
                    }
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
                sorts:''
               
            }
        },
        created(){
            this.getRoleId();
            this.initWokerList();
            this.initTaskTypes();
            this.initType();
            this.getComDataHandle();
            this.initCity();
            this.initOrderStatus();
            this.initCarStatus();
            this.initDisType();
        },
        computed: {
            test:function () {
                this.comList
                this.cityList
                this.taskTypes
                this.tableData
                return this
            }
        },
        watch: {
            test(){
                if(this.tableData.length>0 && this.comList.length>0 && this.cityList.length>0 && Object.keys(this.taskTypes).length>0){
                    this.handleData()
                }
            }
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
                        // console.log(this.wokerList)
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
                data.role_id = this.role_id;
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

                
                data.where = qs.stringify(copyData);
                this.where = qs.stringify(copyData);
                this.$http.post(this.reqUrl,data,).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                    if (res.code === 200) {
                        this.tableData = res.data.data;
                        this.total = parseInt(res.data.total);
                        
                    }else {
                        this.tableData=[];
                        this.page=1;
                    }
                }).catch(err => {
                    console.log(err);
                    this.$store.dispatch('loadingAction',false);
                })
            },
            handleData(){
                this.tableData.forEach(item => {
                    let cityArr = [],taskArr = [];
                   
                    this.comList.forEach(item2 => {
                        if(item.car_company_id == item2.id){
                            item.car_company_id = item2.full_name;
                        }
                    })

                    if(parseInt(item.car_company_id) || parseInt(item.car_company_id)==0){
                        item.car_company_id = ''
                    }

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
            getComDataHandle(){
                getComData().then(res => {
                    if(res.code === 200){
                        this.comList = res.data;
                        // console.log(this.comList)
                    }else{
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    console.log(err)
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
                this.$store.dispatch('loadingAction',true)
                this.$http.post('/work/order/view',{id}).then((response)=>{
                    this.$store.dispatch('loadingAction',false)
                    var res = response.data;
                    if(res.code === 200){
                        this.viewDialog = true;
                        let taskArr = [];
                        this.orderData = res.data;

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


                        this.wokerList.forEach(item => {
                            if(item.user_id == this.orderData.work.create_user_id){
                                this.orderData.work.create_user_id = item.user_name
                            }
                        })

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
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('loadingAction',false)
                }) 
            },
            //edit
            edit(row){

                this.$http.post('/work/order/view',{id:row.id}).then((response)=>{
                    var res = response.data;
                    if(res.code === 200){
                        this.editDialog = true;
                        this.editData = res.data;
                
                        this.editForm.workOrder.workOrderId = row.id;
                        this.editForm.workOrder.carId = row.carId;

                        this.editForm.workOrder.createUserId = res.data.work.create_user_id;
                        this.editForm.workOrder.userId = res.data.work.user_id;
                        this.editForm.workOrder.taskList[0].taskId = res.data.task.taskId;
                        if(res.data.task.task_types){
                            this.editForm.workOrder.taskList[0].taskType = res.data.task.task_types.slice(1,-1);
                        }
                        this.editForm.workOrder.instruction = res.data.task.instruction;
                        this.editForm.workOrder.distributeType = res.data.work.distribute_type;
                        // console.log(this.editForm)

                    }
                }) 
            },
            //editFinish
            editFinish(){
                let data = _.cloneDeep(this.editForm)
                // console.log(data)
                data.workOrder.taskList[0].instruction = data.workOrder.instruction;

                if(data.workOrder.taskList[0].taskType==''){
                    message(this,'任务类型不能为空','error');
                    return;
                }

                if(data.workOrder.distributeType=='1' && data.workOrder.userId==''){
                    message(this,'地服人员不能为空','error');
                    return;
                }

                if(data.workOrder.taskList[0].instruction==''){
                    message(this,'任务描述不能为空','error');
                    return;
                }

                data.workOrder = JSON.stringify(data.workOrder);
                
                this.$http.post('/staff/staff-order/update-order',data).then((response)=>{
                    var res = response.data;
                    if(res.errCode === 0){
                        this.editDialog = false;
                        this.getListData()
                        message(this, res.message, 'success')
                    }else{
                        message(this, res.message, 'error')
                    }
                }) 
            },
            //撤销
            dele(row){
               
                this.$prompt('请输入备注', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /.{1,}/,
                    inputErrorMessage: '备注不能为空'
                }).then(({ value }) => {
                    var req={
                        workOrderId:row.id,
                        cancleReason:value,
                        businessType:1
                    };
                    this.$http.get('/staff/staff-order/revokeWorkOrder', {params:req},{type:'payload'}).then((response) => {
                        var res = response.data;
                        if (res.errCode === 0) {
                            message(this,res.message,'success')
                            this.getListData();
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch(() => {      
                });
            },
            //导出
            exportExel(type){
                let url = '',req;
                if(type == 1){
                    url = '/work/abnormal/doing/export';
                    req = {role_id:this.role_id,where:this.where}
                }else{
                    url = '/work/abnormal/doing/exports';
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
                            let titleSet = new Set(res.data.title)
                            titleSet.delete("车辆所属地服供应商")
                            titleSet = Array.from(titleSet)
                            let props=['city_name','order_num','status','task_value','brand','license_tag','create_time'];
                            exportExcel('未处理工单列表',titleSet,props,res.data.data);
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
      
    }
</script>
<style lang="less">
    .nothandled-order {
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

    .nothandled-order .filter-form{
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
    
</style>
