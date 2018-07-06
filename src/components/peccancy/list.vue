<template>
    <div class="pec-list">
        <div style="margin-bottom: 20px" >
            <el-button size="mini" type="text" v-show="!isShowFilterForm" @click="filterFormSwitch(true)">展开</el-button>
        </div>
        
        <el-row class="filter-form" v-show="isShowFilterForm">
            <el-row>
                <el-button size="text" style="font-size:12px;" @click="filterFormSwitch(false)">隐藏</el-button>
            </el-row>
            <el-col :span="24" class="search-form">
                <el-form :model="filterForm" :inline="true" label-width="120px">
                    <el-form-item label="车牌号">
                        <el-input v-model="filterForm.car_number" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="filterForm.phone_num" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="姓名">
                        <el-input v-model="filterForm.name" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="城市">
                        <sourceSelect 
                            clearable
                            :valProp.sync="filterForm.city_id"
                            url="/city/city/all"
                            :config="cityConfig" />
                    </el-form-item>
                    <el-form-item label="用户违章状态">
                        <el-select clearable v-model="filterForm.client_status" style="width:155px" size="small" placeholder="请选择">
                            <el-option label="未处理" value="1"></el-option>
                            <el-option label="已处理" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="认可状态">
                        <el-select clearable v-model="filterForm.accept_status" style="width:155px" size="small" placeholder="请选择">
                            <el-option label="未联系" value="1"></el-option>
                            <el-option label="认可-客户自行处理" value="2"></el-option>
                            <el-option label="认可-需运营处理" value="3"></el-option>
                            <el-option label="不认可-有异议" value="4"></el-option>
                            <el-option label="不认可-强烈不认可" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="违章真实状态">
                        <el-select clearable v-model="filterForm.peccancy_status" style="width:155px" size="small" placeholder="请选择">
                            <el-option label="未消除" value="1"></el-option>
                            <el-option label="已消除" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否逾期">
                        <el-select clearable v-model="filterForm.overdue_status" style="width:155px" size="small" placeholder="请选择">
                            <el-option label="未逾期" value="1"></el-option>
                            <el-option label="已逾期" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="运营处理情况">
                        <el-select clearable v-model="filterForm.handle_status" style="width:155px" size="small" placeholder="请选择">
                            <el-option label="未处理" value="1"></el-option>
                            <el-option label="公司处理" value="2"></el-option>
                            <el-option label="用户处理" value="3"></el-option>
                            <el-option label="协助处理" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="逾期是否支付">
                        <el-select clearable v-model="filterForm.pay_money" style="width:155px" size="small" placeholder="请选择">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="违章匹配类型">
                        <el-select clearable v-model="filterForm.order_type" style="width:155px" size="small" placeholder="请选择">
                            <el-option label="订单" value="1"></el-option>
                            <el-option label="工单" value="2"></el-option>
                            <el-option label="未匹配" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="违章时间">
                        <el-date-picker
                            size="small"
                            v-model="filterForm.peccancy_time"
                            type="datetimerange"
                            value-format="timestamp"
                            align="right"
                            :default-time="['00:00:00', '23:59:59']"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker
                        size="small"
                        :default-time="['00:00:00', '23:59:59']"
                        v-model="filterForm.create_time"
                        type="datetimerange"
                        value-format="timestamp"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                    
                </el-form>
            </el-col>
            <el-col :span="24">
                <el-button size="small" type="primary" @click="search(true)">搜索</el-button>
                <el-button size="small" @click="search(false)">重置</el-button>
                <el-button size="small" @click="refresh">刷新</el-button>
            </el-col>
        </el-row>
        <div>
            <el-button size="mini" type="primary" v-if="cp('--/peccancy/peccancy/export')" @click="exportExel(1)">导出当前列表</el-button>
            <el-button size="mini" type="primary" v-if="cp('--/peccancy/peccancy/exports')" @click="exportExel(2)">导出全部列表</el-button>
            <el-table 
                :data="tableData"
               
                @sort-change="sortChange"
                border
                style="width: 100%;margin-top:20px;">
                <el-table-column
                    label="操作"
                    fixed
                    width="180">
                    <template slot-scope="scope">
                        <el-button size="mini" style="margin-left:10px;margin-bottom:10px" v-if="cp('--/peccancy/peccancy/view')" type="primary" @click="edit(scope.row.peccancy_id,1,scope.row.overdue_status)">查看</el-button>

                        <el-button size="mini" style="margin-bottom:10px" v-if="cp('--/peccancy/peccancy/edit')" type="primary" @click="edit(scope.row.peccancy_id,2)">修改</el-button>

                        <el-button size="mini" style="margin-bottom:10px" v-if="cp('--/peccancy/peccancy/remark')" type="warning" @click="remark(scope.row.peccancy_id)">备注</el-button>

                        <el-button size="mini" style="margin-bottom:10px" v-show="cp('--/peccancy/peccancy/handle')" v-if="scope.row.handle_status==1&&(scope.row.client_status==1||scope.row.pay_money>0)" type="danger" @click="handle(scope.row.peccancy_id)">处理</el-button>

                        <el-button size="mini" style="margin-bottom:10px" v-show="cp('--/peccancy/peccancy/status')" v-if="scope.row.order_type!=3" type="danger" @click="remove(scope.row.peccancy_id)">解除</el-button>

                        <el-button size="mini" style="margin-bottom:10px" v-show="cp('--/peccancy/peccancy-sms/send')" type="danger" @click="send(scope.row.peccancy_id, scope)">发短信</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    
                    label="编号"
                    prop="peccancy_id">
                </el-table-column>
                <el-table-column
                    
                    label="城市"
                    prop="city_id">
                </el-table-column>
                <el-table-column
                    sortable="custom"
                    label="违章时间"
                    prop="peccancy_time">
                </el-table-column>
                <el-table-column
                    label="车牌号"
                    prop="car_number">
                </el-table-column>
                <el-table-column
                    label="违章地址"
                    prop="peccancy_addr">
                </el-table-column>
                <el-table-column
                    prop="peccancy_why"
                    label="违章原因">
                </el-table-column>
                <el-table-column
                    prop="peccancy_money"
                    label="罚款(元)">
                    <template slot-scope="scope">
                        <span>{{scope.row.peccancy_money/100}}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                prop="peccancy_score"
                label="扣分">
                </el-table-column>
                <el-table-column 
                label="关联订单/工单号" 
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.order_num && scope.row.order_type==1">订单-</span>
                        <span v-if="scope.row.order_num && scope.row.order_type==2">工单-</span>
                        <span v-if="scope.row.order_type!=3">{{scope.row.order_num}}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    
                    prop="name"
                    label="姓名">
                </el-table-column>
                <el-table-column 
                    
                    prop="phone_num"
                    label="手机号">
                </el-table-column>
                <el-table-column 
                    label="是否认可">
                    <template slot-scope="scope">
                        <span v-if="scope.row.accept_status == 1">未联系</span>
                        <span v-if="scope.row.accept_status == 2">认可-客户自行处理</span>
                        <span v-if="scope.row.accept_status == 3">认可-需运营处理</span>
                        <span v-if="scope.row.accept_status == 4">不认可-有异议</span>
                        <span v-if="scope.row.accept_status == 5">不认可-强烈不认可</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    
                    label="运营处理情况">
                    <template slot-scope="scope">
                        <span v-if="scope.row.handle_status == 1">未处理</span>
                        <span v-if="scope.row.handle_status == 2">公司处理 </span>
                        <span v-if="scope.row.handle_status == 3">用户处理</span>
                        <span v-if="scope.row.handle_status == 4">协助处理</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    
                    label="用户违章状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.client_status == 1">未处理</span>
                        <span v-if="scope.row.client_status == 2">已处理 </span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="是否逾期">
                    <template slot-scope="scope">
                        <span v-if="scope.row.overdue_status == 1">未逾期</span>
                        <span v-if="scope.row.overdue_status == 2">已逾期 </span>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="违章真实状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.peccancy_status == 1">未消除</span>
                        <span v-if="scope.row.peccancy_status == 2">已消除 </span>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="pay_money"
                    label="违章支付金额(元)"> 
                    <template slot-scope="scope">
                        <span>{{scope.row.pay_money/100}}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    sortable="custom"
                    prop="create_time"
                    label="创建时间">
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
                            <el-form-item label="撤销/取消时间：">
                                <span>{{orderData.work.modify_time}}</span>
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
            <p class="tag-lab">工单定价</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
                <el-form  :inline="true">
                    <el-form-item label="工单定价(元)：">
                        <span>{{orderData.price.order_price}}</span>
                    </el-form-item>
                    <el-form-item label="取车公交费用(元)：">
                        <span>{{orderData.price.route_price}}</span>
                    </el-form-item>
                    <el-form-item label="导航行驶里程费(元)：">
                        <span>{{orderData.price.order_km_fee}}</span>
                    </el-form-item>
                    <el-form-item label="导航行驶时长费(元)：">
                        <span>{{orderData.price.order_long_fee}}</span>
                    </el-form-item>
                </el-form>
            </el-row>
            <p class="tag-lab">备注</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
                <span>{{orderData.message}}</span>
            </el-row>
        </el-dialog>

        <!--修改-->
        <el-dialog :title="title" :visible.sync="addEditDialog">
            <p  class="tag-lab">违章信息</p>
            <el-row key="t1" style="padding:15px;border-top:2px solid #3c8dbc">
                <el-table 
                    :data="[editData.peccancy]"
                    :default-sort = "{prop: 'createTime', order: 'descending'}"
                    border
                    style="width: 100%">
                    <el-table-column
                        
                        label="编号"
                        prop="peccancy_id">
                    </el-table-column>
                    <el-table-column
                        
                        label="违章时间"
                        prop="peccancy_time">
                    </el-table-column>
                    <el-table-column
                        label="车牌号"
                        prop="car_number">
                    </el-table-column>
                    <el-table-column
                        label="违章地址"
                        prop="peccancy_addr">
                    </el-table-column>
                    <el-table-column
                        prop="peccancy_why"
                        label="违章原因">
                    </el-table-column>
                    <el-table-column
                        
                        prop="peccancy_money"
                        label="罚款(元)">
                        <template slot-scope="scope">
                            <span>{{scope.row.peccancy_money/100}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                    
                    prop="peccancy_score"
                    label="扣分">
                    </el-table-column>

                    <el-table-column
                        v-if="title=='查看'"
                        
                        prop="order_num"
                        label="关联订单/工单号">
                    </el-table-column>
                    <el-table-column
                        v-if="title=='查看'"
                        
                        prop="name"
                        label="姓名">
                    </el-table-column>
                    <el-table-column
                        v-if="title=='查看'"
                        
                        prop="phone_num"
                        label="手机号">
                    </el-table-column>
                </el-table>
            </el-row>

            <p  v-if="title=='修改'" class="tag-lab">订单/工单信息</p>
            <el-row key="t2" v-if="title=='修改'" style="padding:15px;border-top:2px solid #3c8dbc">
                <el-table 
                    :data="[editData.peccancy]"
                    border
                    style="width: 100%">
                    <el-table-column
                        
                        label="类型"
                        >
                        <template slot-scope="scope">
                            <span v-if="scope.row.order_type == 1">订单</span>
                            <span v-if="scope.row.order_type == 2">工单 </span>
                            <span v-if="scope.row.order_type == 3">未匹配 </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        
                        label="订单/工单号"
                        prop="order_num">
                    </el-table-column>
                    <el-table-column
                        label="下单时间"
                        prop="create_time">
                    </el-table-column>
                    <el-table-column
                        label="姓名"
                        prop="name">
                    </el-table-column>
                    <el-table-column
                        prop="phone_num"
                        label="账号/手机号">
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                             <el-button size="mini" type="primary" v-if="scope.row.order_type==2" @click="viewOrder(scope.row.order_id)">查看工单</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <p v-if="title=='查看' && overdue_status==2" class="tag-lab">逾期记录</p>

            <el-row v-if="title=='查看' && overdue_status==2" style="padding:15px;border-top:2px solid #3c8dbc">
                <el-table 
                    :data="[editData.peccancy]"
                    border
                    style="width: 100%">
                    <el-table-column
                        
                        prop="modify_time"
                        label="逾期时间"
                        >
                    </el-table-column>
                    <el-table-column
                        
                        label="逾期金额(元)">
                        <template slot-scope="scope">
                            <p>{{(scope.row.peccancy_money/100+scope.row.peccancy_score_fee+scope.row.late_fee).toFixed(2)}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="明细"
                        prop="create_time">
                        <template slot-scope="scope">
                            <p>违章罚款：{{scope.row.peccancy_money/100}}</p>
                            <p>扣分折算：{{scope.row.peccancy_score_fee}}</p>
                            <p>逾期补偿：{{scope.row.late_fee}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="支付时间"
                        prop="pay_time">
                    </el-table-column>
                    <el-table-column
                        prop="pay_money"
                        label="支付金额(元)">
                        <template slot-scope="scope">
                            <span>{{scope.row.pay_money/100}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        
                        prop="pay_id"
                        label="账单号">
                    </el-table-column>
                    <el-table-column
                        
                        prop="name"
                        label="姓名">
                    </el-table-column>
                    <el-table-column
                        
                        prop="phone_num"
                        label="手机号">
                    </el-table-column>
                </el-table>
            </el-row>

            <p class="tag-lab">操作记录</p>
            <el-row style="padding:15px;border-top:2px solid #3c8dbc">
                <el-table 
                    :data="editData.log"
                    :default-sort = "{prop: 'createTime', order: 'descending'}"
                    border
                    style="width: 100%">
                    <el-table-column
                        
                        label="编号"
                        prop="id">
                    </el-table-column>
                    <el-table-column
                        
                        label="操作时间"
                        prop="create_time">
                    </el-table-column>
                    <el-table-column
                        label="操作来源"
                        prop="type">
                        <template slot-scope="scope">
                            <span v-if="scope.row.type == 1">后台操作</span>
                            <span v-if="scope.row.type == 2">api接口 </span>
                            <span v-if="scope.row.type == 3">数据来源 </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作人"
                        prop="user_name">
                    </el-table-column>
                    <el-table-column
                        label="操作记录">
                        <template slot-scope="scope">
                            <span v-if="scope.row.mess_type == 1">备注 </span>
                            <span v-if="scope.row.mess_type == 2">修改  </span>
                            <span v-if="scope.row.mess_type == 3">处理  </span>
                            <span v-if="scope.row.mess_type == 4">解除  </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        
                        prop="message"
                        label="备注">
                    </el-table-column>
                </el-table>
            </el-row>

            <p class="tag-lab" v-show="title=='修改'">修改信息</p>
            <el-row v-show="title=='修改'" style="padding:15px;border-top:2px solid #3c8dbc">
                <el-form :model="editForm" :inline="true">
                    
                    <el-form-item label="类型">
                        <el-select v-model="editForm.order_type" size="small" placeholder="请选择">
                            <el-option
                            label="订单"
                            value="1">
                            </el-option>
                            <el-option
                            label="工单"
                            value="2">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="单号">
                        <el-input v-model="editForm.order_num" size="small"></el-input>
                    </el-form-item>
                    
                    <el-button size="small" type="primary" style="margin-top:4px" @click="editFinish">提交</el-button>
                    
                </el-form>
            </el-row>

        </el-dialog>

        <!-- 备注 -->
        <el-dialog title="确认备注吗？" :visible.sync="remarkDialog">
            <el-form :model="remarkForm" style="width:50%;margin:0 auto" label-width="100px">
                <el-form-item label="沟通结果">
                    <el-select v-model="remarkForm.accept_status" size="small" placeholder="请选择">
                        <el-option label="认可-客户自行处理" value="2"></el-option>
                        <el-option label="认可-需运营处理" value="3"></el-option>
                        <el-option label="不认可-有异议" value="4"></el-option>
                        <el-option label="不认可-强烈不认可" value="5"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="remarkForm.message" type="textarea" size="small" placeholder="请输入备注内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="remarkDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="remarkFinish">确定</el-button>
            </div>
        </el-dialog>

        <!-- 处理 -->
        <el-dialog title="确认处理吗？" :visible.sync="handleDialog">
            <p style="color:red">
                处理完之后根据情况选择（公司处理：公司自己出钱处理，用户处理：用户逾期付款，公司处理的，协助处理：协助用户线下处理）
            </p>
            <el-form :model="handleForm" style="width:50%;margin:0 auto" label-width="100px">
                <el-form-item label="处理结果">
                    <el-select v-model="handleForm.handle_status" size="small" placeholder="请选择">
                        <el-option label="公司处理" value="2"></el-option>
                        <el-option label="用户处理" value="3"></el-option>
                        <el-option label="协助处理" value="4"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="handleForm.message" type="textarea" size="small" placeholder="请输入备注内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="handleFinish">确定</el-button>
            </div>
        </el-dialog>

        <!-- 发短信 -->
        <el-dialog title="发短信" :visible.sync="sendDialog">
            <el-form :model="handleForm" style="width:50%;margin:0 auto" label-width="100px">
                <!-- <el-form-item label="编号：">
                    {{sendData.peccancy_id}}
                </el-form-item>
                <el-form-item label="城市：">
                    {{sendData.city_id}}
                </el-form-item>
                <el-form-item label="违章时间：">
                    {{sendData.peccancy_time}}
                </el-form-item>
                <el-form-item label="车牌号：">
                    {{sendData.car_number}}
                </el-form-item>
                <el-form-item label="违章地址：">
                    {{sendData.peccancy_addr}}
                </el-form-item>
                <el-form-item label="违章原因：">
                    {{sendData.peccancy_why}}
                </el-form-item>
                <el-form-item label="罚款（元）：">
                    {{sendData.peccancy_money}}
                </el-form-item>
                <el-form-item label="扣分：">
                    {{sendData.peccancy_score}}
                </el-form-item>
                <el-form-item label="姓名：">
                    {{sendData.name}}
                </el-form-item> -->
                <el-form-item label="类型：">
                    <el-radio-group v-model="sendForm.peccancy_type" @change="peccancyTypeChange($event)">
                        <el-radio :label="1">系统违章通知</el-radio>
                        <el-radio :label="2">人工通知</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-show="sendForm.peccancy_type==2" label="联系人电话：">
                    <el-input  v-model="sendForm.phone"  size="small" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item v-show="sendForm.peccancy_type==2" label="交警大队：">
                    <el-select v-model="sendForm.traffic_police" size="small" placeholder="请选择交警大队">
                        <el-option label="李沧交警大队" value="李沧交警大队"></el-option>
                        <el-option label="市北交警大队" value="市北交警大队"></el-option>
                        <el-option label="岳麓交警大队" value="岳麓交警大队"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item  label="短信内容：">
                    <el-button size="small" style="width:40px" type="text" @click="viewSendData">查看</el-button>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="sendDialog = false">取消</el-button>
                <el-button size="small" type="primary" @click="sendFinish">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import qs from 'qs'
    import message from '../../assets/js/message'
    import sourceSelect from '../common/sourceSelect';
    import {DOWN_URL,picUrl} from '../../config/app';
    import cp from '../../utils/checkPermissions';
    import exportExcel from '../../assets/js/exportExcel';
    import picpreview from '../common/picpreview';
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
                reqUrl:'/peccancy/peccancy/list',
                cityConfig:['baiduid','cityname','data'],
                addEditDialog:false,
                remarkDialog:false,
                handleDialog:false,
                sendDialog: false,
                title:'',
                role_id:'',
                cityList:[],
                filterForm:{
                    page:1,
                    pageSize:10,
                    car_number:'',
                    phone_num:'',
                    name:'',
                    city_id:'',
                    client_status:'',
                    accept_status:'',
                    peccancy_status:'',
                    overdue_status:'',
                    handle_status:'',
                    pay_money:'',
                    order_type:'',
                    peccancy_time:[],
                    create_time:[]

                },
                isShowFilterForm:true,
                editForm:{
                    order_type:'1',
                    order_num:'',
                    peccancy_id:'',
                    user_id:'',
                },
                remarkForm:{
                    accept_status:'',
                    message:'',
                    peccancy_id:'',
                },
                handleForm:{
                    handle_status:'',
                    message:'',
                    peccancy_id:'',
                },
                sendData: {

                },
                note: '',
                sendForm: {
                    peccancy_id: '',
                    phone: '',
                    peccancy_type: '',
                    traffic_police: ''
                },
                editData:{
                   peccancy:{},
                   log:{}
                },
                role_id:'',
                user_id:'',
                overdue_status:'',
                viewDialog:false,
                comList:[],
                cityList:[],
                types:{},
                taskTypes:[],
                orderStatus:{},
                disType:{},
                wokerList:[],
                carStatus:{},
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
            this.initCity();
            this.initWokerList();
            this.initTaskTypes();
        },
        mounted() {
            this.getListData()
        },
        computed: {
            test:function () {
                this.tableData
                this.cityList
                return this
            }
        },
        watch: {
            test(){
                if(this.tableData.length>0 && this.cityList.length>0){
                    this.handleData()
                }
            }
        },
        methods: {
            cp,
            //获取当前用户id
            getRoleId(){
                let user = localStorage._MyDaDao_user_data;
                if(user){
                    this.role_id = JSON.parse(user).role_id;
                    this.user_id = JSON.parse(user).user_id;
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
            handleData(){
                this.tableData.forEach(item => {
                    
                    let cityArr = [];
                    item.create_time = DateFormat.format(new Date(parseInt(item.create_time)*1000));
                    item.peccancy_time = DateFormat.format(new Date(parseInt(item.peccancy_time)*1000))

                    if(item.city_id){
                        item.city_id.split(',').forEach( codeItem => {
                            this.cityList.forEach(item3 => {
                                if(codeItem == item3.baiduid){
                                    cityArr.push(item3.cityname)
                                }
                            })
                        })
                        item.city_id = _.cloneDeep(cityArr)
                    }
                })
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
                    data.sort = 'peccancy_id&desc'
                }
                
                delete copyData.page;
                delete copyData.pageSize;

                if(copyData.create_time!=null && copyData.create_time[0]){
                    copyData.create_time = copyData.create_time[0]/1000+'--'+copyData.create_time[1]/1000;
                }else{
                    copyData.create_time = '';
                }

                if(copyData.peccancy_time!=null && copyData.peccancy_time[0]){
                    copyData.peccancy_time = copyData.peccancy_time[0]/1000+'--'+copyData.peccancy_time[1]/1000;
                }else{
                    copyData.peccancy_time = ''
                }
                

                data.role_id = this.role_id;
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
            viewOrder(order_id){
                this.viewDialog = true;
                this.addEditDialog = false;
                this.$http.post('/work/order/view',{id:order_id}).then((response)=>{
                    var res = response.data;
                    if(res.code === 200){
                      
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
                }) 
            },
            editFinish(){
                let data = _.cloneDeep(this.editForm);
                this.addEditDialog = false;
                this.$http.post('/peccancy/peccancy/edit',data,{type:'payload'}).then((response)=>{
                    var res= response.data;
                    
                    if(res.code == 200){
                        this.getListData();
                        message(this,res.message,'success')
                    }else {
                        message(this,res.message,'error')
                    }
                })
            },
            edit(peccancy_id,type,overdue_status){
                let url;
                if(type == 1){
                    this.title = '查看';
                    url = '/peccancy/peccancy/view';
                    this.overdue_status = overdue_status;
                }else{
                    this.title = '修改';
                    url = '/peccancy/peccancy/edit-view'
                    for(let i in this.editForm){
                        this.editForm[i] = i=='order_type'? '1':'';
                    }
                }

                this.$http.post(url,{peccancy_id}).then((response)=>{
                    var res = response.data;
                    if(res.code == 200){
                        this.addEditDialog = true;
                        this.editData = res.data;
                        
                        this.editForm.peccancy_id = peccancy_id;
                        this.editForm.user_id = this.user_id;

                        if(this.editData.peccancy.peccancy_time){
                            this.editData.peccancy.peccancy_time = DateFormat.format(new Date(parseInt(this.editData.peccancy.peccancy_time)*1000));
                        }

                        if(this.editData.peccancy.create_time){
                            this.editData.peccancy.create_time = DateFormat.format(new Date(parseInt(this.editData.peccancy.create_time)*1000));
                        }
                        

                        if(this.editData.peccancy.modify_time){
                            this.editData.peccancy.modify_time = DateFormat.format(new Date(parseInt(this.editData.peccancy.modify_time)*1000));
                        }
                         

                        if(this.editData.peccancy.pay_time){
                            this.editData.peccancy.pay_time = DateFormat.format(new Date(parseInt(this.editData.peccancy.pay_time)*1000));
                        }
                        

                        this.editData.log.forEach(item => {
                            item.create_time = DateFormat.format(new Date(parseInt(item.create_time)*1000));
                        })
                    }
                })
            },
            remark(peccancy_id){
                this.remarkDialog = true;
                this.remarkForm.peccancy_id = peccancy_id;
                this.remarkForm.accept_status = '';
                this.remarkForm.message = '';
            },
            remarkFinish(){
                this.remarkDialog = false;
                this.$http.post('/peccancy/peccancy/remark', this.remarkForm,{type:'payload'}).then((response) => {
                    var res = response.data;
                    if (res.code == 200) {
                        message(this,res.message,'success')
                        this.getListData();
                        
                    } else {
                        message(this,res.message,'error')
                    }
                })
            },
            //发短信
            send (peccancy_id, scope) {
                this.sendDialog = true
                this.sendForm.peccancy_id = peccancy_id
                this.sendForm.phone = ''
                this.sendForm.peccancy_type = 1
                this.sendForm.traffic_police = ''
                this.sendData = _.cloneDeep(scope.row)
                if (this.sendData.city_id) {
                    this.sendData.city_id = this.sendData.city_id.join(',')
                }
                if (this.sendData.peccancy_money) {
                    this.sendData.peccancy_money = Math.ceil(this.sendData.peccancy_money/100)
                }
                if (!this.sendData.peccancy_score) {
                    this.sendData.peccancy_score = 0
                }
                if (this.sendData.peccancy_score > 0) {
                    this.note = `【大道用车】您使用的小型汽车${this.sendData.car_number}于${this.sendData.peccancy_time}在${this.sendData.peccancy_addr}，违章原因:${this.sendData.peccancy_why}，罚金${this.sendData.peccancy_money}元，扣${this.sendData.peccancy_score}分。请于收到本告知之日起7日内接受处理。如有疑问，请致电大道用车客服热线：400-616-6161，预约违章处理事宜理。`
                } else {
                    this.note = `【大道用车】您使用的小型汽车${this.sendData.car_number}于${this.sendData.peccancy_time}在${this.sendData.peccancy_addr}，违章原因:${this.sendData.peccancy_why}，罚金${this.sendData.peccancy_money}元，扣${this.sendData.peccancy_score}分。请于收到本告知之日起7日内接受处理。如有疑问，请致电大道用车客服热线：400-616-6161`
                }
            },
            viewSendData () {
                var reg=/^1[3|4|5|7|8|9][0-9]\d{8}$/
                if (!this.sendForm.peccancy_type) {
                    message(this,'请输入类型','error')
                    return
                }
                if (this.sendForm.peccancy_type == 2) {
                    if (!this.sendForm.phone) {
                        message(this,'请输入手机号','error')
                        return
                    }
                    if (!reg.test(this.sendForm.phone)) {
                        message(this,'请输入正确格式的手机号','error')
                        return
                    }
                    if (!this.sendForm.traffic_police) {
                        message(this,'请输入交警大队','error')
                        return
                    }
                    this.sendData.data = `【大道用车】请您携带本人身份证和驾驶证，于约定时间到达${this.sendForm.traffic_police}。大道用车的服务人员电话是${this.sendForm.phone}。如需变更预约时间，请致电400-616-6161。`
                } else {
                    this.sendData.data = this.note
                }
                this.$alert(this.sendData.data, '短信内容', {
                    confirmButtonText: '确定',
                })
            },
            sendFinish () {
                var reg=/^1[3|4|5|7|8|9][0-9]\d{8}$/
                if (!this.sendForm.peccancy_type) {
                    message(this,'请输入类型','error')
                    return
                }
                if (this.sendForm.peccancy_type == 2) {
                    if (!this.sendForm.phone) {
                        message(this,'请输入手机号','error')
                        return
                    }
                    if (!reg.test(this.sendForm.phone)) {
                        message(this,'请输入正确格式的手机号','error')
                        return
                    }
                    if (!this.sendForm.traffic_police) {
                        message(this,'请输入交警大队','error')
                        return
                    }
                }
                this.$http.post('/peccancy/peccancy-sms/send', this.sendForm,null,{serveType:1, args: this.sendForm, module: 'oms'}).then((response) => {
                    var res = response.data
                    if (res.code == 200) {
                        message(this,res.message,'success')
                        this.getListData()
                        this.sendDialog = false
                    } else {
                        message(this,res.message,'error')
                    }
                })
            },
            peccancyTypeChange () {
                this.sendForm.phone = ''
                this.sendForm.traffic_police = ''
            },
            handle(peccancy_id){
                this.handleDialog = true;
                this.handleForm.peccancy_id = peccancy_id;
                this.handleForm.handle_status = '';
                this.handleForm.message = '';
            },
            handleFinish(){
                this.handleDialog = false;
                this.$http.post('/peccancy/peccancy/handle', this.handleForm,{type:'payload'}).then((response) => {
                    var res = response.data;
                    if (res.code == 200) {
                        message(this,res.message,'success')
                        this.getListData();
                        
                    } else {
                        message(this,res.message,'error')
                    }
                })
            },
            remove(peccancy_id){
                this.$confirm('是否解除该用户', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var req={peccancy_id};
                    this.$http.post('/peccancy/peccancy/status', req,{type:'payload'}).then((response) => {
                        var res = response.data;
                        if (res.code == 200) {
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
                    url = '/peccancy/peccancy/export';
                    req = {role_id:this.role_id,where:this.where}
                }else{
                    url = '/peccancy/peccancy/exports';
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
                            let props=['ID','city_name','peccancy_time','task_value','peccancy_addr','peccancy_why','peccancy_money','peccancy_score','order_type','name','phone_num','receive_time','handle_status_name','client_status','overdue_status','peccancy_status','pay_money','create_time'];
                            exportExcel('违章列表',res.data.title,props,res.data.data);
                        }
                        
                    }else{
                        message(this,res.message,'error')
                        this.$store.dispatch('loadingAction', false);
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        props: {}
    }
</script>
<style lang="less">
    .pec-list{
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

    .filter-form{
        background: white;
        padding: 10px;
        margin-bottom: 20px;
    }

    .fade-enter-active, .fade-leave-active {
    transition: height 1.5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0;
    }
    .fade-enter-to, .fade-leave /* .fade-leave-active below version 2.1.8 */ {
    height: '300px';
    }
    .el-form--inline .el-form-item__label{
        text-align: left
    }
</style>
<style>
    .pec-list .el-dialog{
        width: 70%!important
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
