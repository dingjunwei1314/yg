<template>
  <div class="work-order">
    <el-row class="filter-form">
      <el-tabs type="card"  v-model="reqUrl">
        <el-tab-pane  :disabled="!cp('--/work/order/list')" label="全部工单" name="/work/order/list"></el-tab-pane>

        <el-tab-pane :disabled="!cp('--/work/order/list-send')" label="已发送" name="/work/order/list-send"></el-tab-pane>

        <el-tab-pane :disabled="!cp('--/work/order/list-doing')" label="进行中" name="/work/order/list-doing"></el-tab-pane>

        <el-tab-pane :disabled="!cp('--/work/order/list-finish')" label="已完成" name="/work/order/list-finish"></el-tab-pane>

        <el-tab-pane :disabled="!cp('--/work/order/list-repeal')" label="已撤销" name="/work/order/list-repeal"></el-tab-pane>

        <el-tab-pane :disabled="!cp('--/work/order/list-cancel')" label="已取消" name="/work/order/list-cancel"></el-tab-pane>
      </el-tabs>

      <div style="margin-bottom: 20px">
        
        <el-button size="mini" type="primary" v-if="cp('--/staff/staff-order/new-order')" @click="append">增加</el-button>
        <el-button size="mini" type="text" v-show="!isShowFilterForm" @click="filterFormSwitch(true)">展开</el-button>
      </div>

      <div v-show="isShowFilterForm">
        <el-row>
          <el-button size="text" style="font-size:12px;" @click="filterFormSwitch(false)">隐藏</el-button>
        </el-row>
        <el-col :span="24" class="search-form">
          <el-form :model="filterForm" :inline="true" label-width="105px">
           
              <el-form-item 
              label="车牌号" >
                <el-input v-model="filterForm.license_tag" size="small" style="width:155px"></el-input>
              </el-form-item>
           
              <el-form-item 
              label="地服姓名"
              v-show="reqUrl!='/work/order/list-send' && reqUrl!='/work/order/list-repeal'">
                <el-input v-model="filterForm.full_name" size="small"
                          style="width:155px"></el-input>
              </el-form-item>
           
              <el-form-item label="工单编号">
                <el-input v-model="filterForm.order_num" size="small" style="width:155px"></el-input>
              </el-form-item>
         
              <el-form-item 
              label="地服手机"
              v-show="reqUrl!='/work/order/list-send' && reqUrl!='/work/order/list-repeal'">
                <el-input v-model="filterForm.phone_num" size="small" style="width:155px"></el-input>
              </el-form-item>
           
              <el-form-item label="下单人员">
                <user :valProp.sync="filterForm.create_user_id"></user>
              </el-form-item>
          
              <el-form-item label="能耗类型">
                <enterType :valProp.sync="filterForm.type"></enterType>
              </el-form-item>
           
              <el-form-item label="城市">
                <citys :valProp.sync="filterForm.area_code"></citys>
              </el-form-item>

              <el-form-item label="连续充电">
                <el-select size="small" clearable style="width:155px" v-model="filterForm.is_continue_charge">
                  <el-option
                    label="是"
                    value="1">
                  </el-option>
                  <el-option
                      label="否"
                      value="0">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="接单方式" v-show="reqUrl!='/work/order/list-repeal'&& reqUrl!='/work/order/list-send'">
                <el-select size="small" clearable style="width:155px" v-model="filterForm.recive_type">
                  <el-option
                    label="派单"
                    value="1">
                  </el-option>
                  <el-option
                      label="搜索"
                      value="2">
                  </el-option>
                  <el-option
                      label="专单"
                      value="3">
                  </el-option>
                  <el-option
                      label="其他"
                      value="4">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="关单方式"  v-show="reqUrl=='/work/order/list-finish' || reqUrl=='/work/order/list'">
                <el-select size="small" clearable style="width:155px" v-model="filterForm.close_type">
                  <el-option
                    label="正常关单"
                    value="1">
                  </el-option>
                  <el-option
                    label="手机端强制关单"
                    value="2">
                  </el-option>
                  <el-option
                    label="后台强制关单"
                    value="3">
                  </el-option>
                  <el-option
                    label="转移工单"
                    value="4">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item 
              label="地服所属供应商"
              v-show="reqUrl!='/work/order/list-send' && reqUrl!='/work/order/list-repeal'">
                <groundCompanyList :valProp.sync="filterForm.user_company_id"></groundCompanyList>
              </el-form-item>
           
              <el-form-item label="任务类型">
                <workOrderType :valProp.sync="filterForm.task_types"></workOrderType>
              </el-form-item>

              <el-form-item label="下单时间">
                <el-date-picker
                  style="min-width:350px"
                  size="small"
                  v-model="filterForm.create_time"
                  type="datetimerange"
                  value-format="timestamp"
                  :default-time="['00:00:00', '23:59:59']"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item 
              label="接单时间"
              v-show="reqUrl!='/work/order/list-send' && reqUrl!='/work/order/list-repeal'">
                <el-date-picker
                  style="min-width:350px"
                  size="small"
                  v-model="filterForm.receive_time"
                  type="datetimerange"
                  value-format="timestamp"
                  range-separator="-"
                  :default-time="['00:00:00', '23:59:59']"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item 
              label="完成时间"
              v-show="reqUrl=='/work/order/list' || reqUrl=='/work/order/list-finish'">
                <el-date-picker
                  size="small"
                  style="min-width:350px"
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="filterForm.finish_time"
                  type="datetimerange"
                  value-format="timestamp"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item 
              label="取消时间"
              v-show="reqUrl=='/work/order/list-cancel'">
                <el-date-picker
                  size="small"
                  style="min-width:350px"
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="filterForm.modify_time"
                  type="datetimerange"
                  value-format="timestamp"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>

              <el-form-item 
              label="撤销时间"
              v-show="reqUrl=='/work/order/list-repeal'">
                <el-date-picker
                  size="small"
                  style="min-width:350px"
                  :default-time="['00:00:00', '23:59:59']"
                  v-model="filterForm.modify_time"
                  type="datetimerange"
                  value-format="timestamp"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
           
          </el-form>
        </el-col>
        <el-col  style="margin-top: 20px">
          <el-button size="small" type="primary" @click="search(true)">搜索</el-button>
          <el-button size="small" @click="search(false)">重置</el-button>
          <el-button size="small" @click="refresh">刷新</el-button>
        </el-col>
      </div>
    </el-row>
    <div>
      <el-button size="mini" type="primary" v-if="cp('--/work/order/export')" @click="exportExel(1)">导出当前列表</el-button>
      <el-button size="mini" type="primary" v-if="cp('--/work/order/exports')" @click="exportExel(2)">导出全部列表</el-button>
      <el-table
        :data="tableData"
        @sort-change="sortChange"
        border
        style="width: 100%;margin-top:20px;">
        <el-table-column
          label="操作"
          fixed
          >
          <template slot-scope="scope">
            <el-button size="mini" style="margin-bottom:10px" v-if="cp('--/work/order/view')" type="primary" @click="view(scope.row.id)">查看</el-button>
            
            <el-button size="mini" v-if="cp('--/staff/staff-order/close-order')" style="margin-left:0px;margin-bottom:10px"  v-show="reqUrl==='/work/order/list-doing'" type="danger" @click="close(scope.row)">强关</el-button>

            <el-button size="mini" style="margin-left:0px;margin-bottom:10px" v-if="cp('--/staff/staff-order/update')" type="warning" v-show="scope.row.status==0" @click="edit(scope.row)">修改</el-button>

            <el-button size="mini" style="margin-left:0px;margin-bottom:10px" v-if="cp('--/staff/staff-order/revoke')" type="danger" v-show="scope.row.status==0" @click="dele(scope.row)">撤销</el-button>
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
          label="工单状态"
          prop="status">
          <template slot-scope="scope">
            <span>{{workStatus[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="task_types"
          label="任务类型">
          <template slot-scope="scope">
            <span v-for="item in scope.row.task_types.split(',')" :key="item">
              {{workOrderType[item]}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="model"
          label="车型">
        </el-table-column>
        <el-table-column
          label="车牌号"
          prop="license_tag">
        </el-table-column>
        <el-table-column
          label="地服姓名"
          prop="full_name">
        </el-table-column>
        <el-table-column
          label="地服手机号"
          prop="phone_num">
        </el-table-column>
        <el-table-column
          label="地服所属地服供应商"
          prop="user_company_id">
          <template slot-scope="scope">
            <span>{{companyList[scope.row.user_company_id]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
          sortable="custom">
        </el-table-column>
        <el-table-column
          label="接单时间"
          v-if="reqUrl!='/work/order/list-send' && reqUrl!='/work/order/list-repeal'"
          prop="receive_time"
          sortable="custom">
        </el-table-column>
        <el-table-column
          label="完成时间"
          v-if="reqUrl=='/work/order/list' || reqUrl=='/work/order/list-finish'"
          prop="finish_time"
          sortable="custom">
        </el-table-column>
        <el-table-column
          label="撤销时间"
          key="1"
          v-if="reqUrl=='/work/order/list-repeal'"
          prop="modify_time"
          sortable="custom">
        </el-table-column>
        <el-table-column
          label="取消时间"
          v-if="reqUrl=='/work/order/list-cancel'"
          prop="modify_time"
          sortable="custom">
        </el-table-column>
        <el-table-column
          label="工单行驶里程(km)"
          prop="travel_mileage">
          <template slot-scope="scope">
            <span>{{parseInt(scope.row.travel_mileage/1000)}}</span>
          </template>
        </el-table-column>
        <div>
          <el-table-column
            label="接单方式"
            v-if="reqUrl!='/work/order/list-repeal' && reqUrl!='/work/order/list-send'"
            key="2">
            <template slot-scope="scope">
              <span v-show="scope.row.recive_type==1">派单</span>
              <span v-show="scope.row.recive_type==2">搜索</span>
              <span v-show="scope.row.recive_type==3">专单</span>
              <span v-show="scope.row.recive_type==4">其他</span>
            </template>
          </el-table-column>
        </div>
        <div>
          <el-table-column
            label="关单方式"
            v-if="reqUrl=='/work/order/list-finish' || reqUrl=='/work/order/list'"
            prop="close_type">
            <template slot-scope="scope">
              <span v-if="scope.row.close_type==1">正常关单</span>
              <span v-if="scope.row.close_type==2">手机端强制关单</span>
              <span v-if="scope.row.close_type==3">后台强制关单</span>
              <span v-if="scope.row.close_type==4">转移工单</span>
            </template>
          </el-table-column>
        </div>
        <!-- <el-table-column
          label="工单积分"
          prop="">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column> -->
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

    <!--增加-->
    <el-dialog :title="title" :visible.sync="addEditDialog">
      <el-form :label-width="'120px'" :inline="true">
        <el-row>
          <el-col :span="17">
            <el-form-item label="查找车辆">
              <el-input v-model="keywords" placeholder="请输入车牌号或订单号" size="small" style="width:400px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
           <el-button @click="searchCarInfo"  type="primary">查询</el-button>
          </el-col>
        </el-row>

        <el-row style="height: 180px">
          <el-col :span="24">
            <el-form-item label="车辆信息">
              <el-table
                :data="addCarInfo" style="width: 100%">
                <el-table-column
                  prop="brand"
                  label="车辆型号"
                  width="50">
                </el-table-column>
                <el-table-column
                    label="能耗类型"
                    prop="type">
                    <template slot-scope="scope">
                        <span>{{types[scope.row.type]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="license_tag"
                  label="车牌号"
                  width="100">
                </el-table-column>
                <el-table-column
                    label="车辆状态"
                    prop="status">
                    <template slot-scope="scope">
                        <span>{{carStatus[scope.row.status]}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="location_name"
                  label="车辆位置"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="electricty"
                  label="剩余电量/油量">
                </el-table-column>
                <el-table-column
                  prop="mileage"
                  label="剩余行驶里程(km)">
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="17">
            <el-form-item label="任务信息">
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item label="派单方式">
              <el-select v-model="addEditForm.workOrder.distributeType" @change="addEditForm.workOrder.userId=''" placeholder="请选择" size="small" style="width: 400px">
                <el-option
                  v-for="(v,k) in workDistributeType"
                  :key="k"
                  :label="v"
                  :value="k">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
         
          <el-col :span="17">
            <el-form-item label="任务类型：">
                <el-select 
                clearable 
                filterable
                v-model="addEditForm.workOrder.taskList[0].taskType" 
                style="width:155px" 
                size="small" 
                placeholder="请选择">
                    <el-option v-for="item in taskTypes" :label="item.name" :value="item.code" :key="item.code"></el-option>
                </el-select>
                

                
            </el-form-item>
          </el-col>
          <el-col :span="17">
            
            <el-form-item label="地服人员" v-show="addEditForm.workOrder.distributeType=='1'">
              <staffUserList :valProp.sync="addEditForm.workOrder.userId"   style="width: 400px"></staffUserList>
              
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item label="任务描述">
              <el-input
                style="width: 400px"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="addEditForm.workOrder.instruction">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addEditDialog = false">取消</el-button>
        <el-button type="primary" @click="addEditFinish">确定</el-button>
      </div>
    </el-dialog>
    <!--查看-->

    <el-dialog title="查看工单" :close-on-press-escape="false" :visible.sync="viewDialog">
        <p class="tag-lab">工单信息</p>
        <el-row style="padding:15px;border-top:2px solid #3c8dbc">
            <el-form class="view-con" :label-width="'120px'" :inline="true">
                <!-- <el-row> -->
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
                <!-- </el-row>
                <el-row> -->
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
                <!-- </el-row>
                <el-row> -->
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
                <!-- </el-row>
                <el-row> -->
                    <el-col :span="12">
                        <el-form-item label="接单时间：">
                            <span>{{orderData.work.receive_time}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" 
                    v-show="reqUrl=='/work/order/list' || reqUrl=='/work/order/list-finish'">
                        <el-form-item label="完成时间：">
                            <span>{{orderData.work.finish_time}}</span>
                        </el-form-item>
                    </el-col>
                <!-- </el-row>
                <el-row> -->
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
                <!-- </el-row>
                <el-row> -->
                    <el-col :span="12">
                        <el-form-item label="地服所属供应商：">
                            <span>{{orderData.work.full_name}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="撤销/取消时间：" 
                        v-show="reqUrl=='/work/order/list-cancel' || reqUrl=='/work/order/list-repeal'">
                            <span>{{orderData.work.finish_time}}</span>
                        </el-form-item>
                    </el-col>
                <!-- </el-row>
                <el-row> -->
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
                <!-- </el-row>
                <el-row> -->
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
                <!-- </el-row>
                <el-row> -->
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
                    <el-col :span="12">
                        <el-form-item label="工单积分：">
                            <span>
                              {{orderData.work.staff_task_price}}
                            </span>
                        </el-form-item>
                    </el-col>
                <!-- </el-row> -->
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
                <!-- <el-table-column
                    label="取车时位置"
                    prop="quche_address">
                </el-table-column>
                <el-table-column
                    label="关单时位置"
                    prop="huanche_address">
                </el-table-column> -->
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
    <el-dialog title="修改工单" :visible.sync="editDialog">
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
                    label="取车时位置"
                    prop="quche_address">
                </el-table-column>
                <!-- <el-table-column
                    label="取车时位置"
                    prop="quche_address">
                </el-table-column>
                <el-table-column
                    label="关单时位置"
                    prop="huanche_address">
                </el-table-column> -->
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
            <el-form >
                <el-form-item label="派单方式：">
                    <el-select 
                    clearable 
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
                    filterable
                    v-model="editForm.workOrder.taskList[0].taskType" 
                    style="width:155px" 
                    size="small" 
                    placeholder="请选择">
                        <el-option v-for="item in taskTypes" :label="item.name" :value="item.code" :key="item.code"></el-option>
                    </el-select>
                    
                </el-form-item>
               
                <el-form-item label="地服人员：" v-show="editForm.workOrder.distributeType=='1'">
                  <staffUserList :valProp.sync="editForm.workOrder.userId"   style="width: 155px"></staffUserList>
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
  import API from '../../api/select'
  import HTTP from '../../api/workorder'
  import message from '../../assets/js/message';
  import picpreview from '../common/picpreview';
  import sourceSelect from '../common/sourceSelect';
  import keyValueSelect from '../common/keyValueSelect';
  import citys from '../common/select/city'
  import enterType from '../common/select/enterType'
  import user from '../common/select/user'
  import workOrderType from '../common/select/workOrderType'
  import groundCompanyList from '../common/select/groundCompanyList'
  import staffUserList from '../common/select/staffUserList'

  import {getComData} from '../../api/parkList';

  import {DOWN_URL,picUrl} from '../../config/app';

  import cp from '../../utils/checkPermissions'
  import exportExcel from '../../assets/js/exportExcel';

  export default {
    components: {
      picpreview,
      sourceSelect,
      keyValueSelect,
      citys,
      enterType,
      user,
      workOrderType,
      groundCompanyList,
      staffUserList,
    },
    data() {
      return {
        picUrl,
        page: 1,//当前也
        total: 0,//总数
        tableData: [],//列表数据
        reqUrl: '/work/order/list',
        addEditDialog: false,
        title: '',
        where: '',
        typeOption: [],
        keywords:'',//搜索关键字
        filterForms:{
          '/work/order/list':{
            page: 1,
            pageSize: 10,
            status: '',
            license_tag: '',
            full_name: '',
            create_time: [],
            order_num: '',
            phone_num: '',
            receive_time: [],
            finish_time: [],
            modify_time:[],
            area_code: '',
            is_continue_charge:'',
            recive_type:'',
            close_type:'',
            car_company_id: '',
            user_company_id: '',
            task_types: '',
            create_user_id:'',
            type:'',
          },
          '/work/order/list-send':{
            page: 1,
            pageSize: 10,
            status: '',
            license_tag: '',
            full_name: '',
            create_time: [],
            order_num: '',
            phone_num: '',
            receive_time: [],
            finish_time: [],
            modify_time:[],
            area_code: '',
            is_continue_charge:'',
            recive_type:'',
            close_type:'',
            car_company_id: '',
            user_company_id: '',
            task_types: '',
            create_user_id:'',
            type:'',
          },
          '/work/order/list-doing':{
            page: 1,
            pageSize: 10,
            status: '',
            license_tag: '',
            full_name: '',
            create_time: [],
            order_num: '',
            phone_num: '',
            receive_time: [],
            finish_time: [],
            modify_time:[],
            area_code: '',
            is_continue_charge:'',
            recive_type:'',
            close_type:'',
            car_company_id: '',
            user_company_id: '',
            task_types: '',
            create_user_id:'',
            type:'',
          },
          '/work/order/list-finish':{
            page: 1,
            pageSize: 10,
            status: '',
            license_tag: '',
            full_name: '',
            create_time: [],
            order_num: '',
            phone_num: '',
            receive_time: [],
            finish_time: [],
            modify_time:[],
            area_code: '',
            is_continue_charge:'',
            recive_type:'',
            close_type:'',
            car_company_id: '',
            user_company_id: '',
            task_types: '',
            create_user_id:'',
            type:'',
          },
          '/work/order/list-repeal':{
            page: 1,
            pageSize: 10,
            status: '',
            license_tag: '',
            full_name: '',
            create_time: [],
            order_num: '',
            phone_num: '',
            receive_time: [],
            finish_time: [],
            modify_time:[],
            area_code: '',
            is_continue_charge:'',
            recive_type:'',
            close_type:'',
            car_company_id: '',
            user_company_id: '',
            task_types: '',
            create_user_id:'',
            type:'',
          },
          '/work/order/list-cancel':{
            page: 1,
            pageSize: 10,
            status: '',
            license_tag: '',
            full_name: '',
            create_time: [],
            order_num: '',
            phone_num: '',
            receive_time: [],
            finish_time: [],
            modify_time:[],
            area_code: '',
            is_continue_charge:'',
            recive_type:'',
            close_type:'',
            car_company_id: '',
            user_company_id: '',
            task_types: '',
            create_user_id:'',
            type:'',
          },
        },
        filterForm: {
         
        },
        addCarInfo:[{
          "id": "",
          "brand": "",
          "type": "",  //引擎类型
          "license_tag": "",
          "status": "",
          "location_name": "",
          "electricty": "", //剩余电量/油量
          "mileage": "", //剩余行驶里程(km)
          "order_num": ""
        }],
        isShowFilterForm: true,
        addEditForm: {
          workOrder:{
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
                taskType:'',
                instruction:''
              }
            ]
          }
        },
        roleList: [],
        workStatus: {},//工单状态映射关系表
        cityList: {},//城市映射关系
        workOrderType: {},//城市映射关系
        sorts:'',//排序
        companyList:{},//供应商列表
        workDistributeType:{},//工单派发类型


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
        user_id:'',
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
        comList:[],
        cityList:[],
        types:{},
        taskTypes:[],
        taskTypesView:[],
        orderStatus:{},
        disType:{},
        wokerList:[],
        carStatus:{},
        where:'',
        cConfig:['id','full_name','phone_num','data'],
        cityConfig:['baiduid','cityname','data'],
        oConfig:['code','name','data'],
        user_id:'',
        flag:true
      }
    },
    created(){
      if(this.$route.query.phone_num){
        for(let i in this.filterForms){
          this.filterForms[i].phone_num = this.$route.query.phone_num
        }
      }
      if(this.$route.query.order_id){
        this.filterForm.order_num = this.$route.query.order_id;
      }
      this.filterForm = this.filterForms['/work/order/list'];
    },

    computed: {
        test:function () {
            this.cityList
            this.tableData
            return this
        }
    },
    watch: {
        'reqUrl': 'statusChange',
        test(){
            if(this.tableData.length>0 && this.cityList.length>0){
                this.handleData()
            }
        }
    },

    mounted() {
      this.getRoleId();
      this.initWokerList();
      this.initTaskTypes();
      this.initType();
      this.initDisType();
      this.getComDataHandle();
      this.initCity();
     
      this.initOrderStatus();
      this.initCarStatus();

      let u_data = JSON.parse(localStorage._MyDaDao_user_data);
      this.$store.dispatch('GetWorkStatus').then((data) => {
        this.workStatus = data;
      })
      this.$store.dispatch('GetCity').then(data => {
        var res = {}
        data.map((item) => {
          res[item.baiduid] = item.cityname;
        })
        this.cityList = res;
      })
      this.$store.dispatch('GetWorkOrderType').then(data => {
        var res = {}
        data.map((item) => {
          res[item.code] = item.name;
        })
        this.workOrderType = res;
      })
      this.$store.dispatch('GetGroundCompanyList').then(data => {
        var res = {}
        data.map((item) => {
          res[item.id] = item.full_name;
        })
        this.companyList = res;
      })

      API.getWorkDistributeType().then(data =>{
        this.workDistributeType=data.data;
      })
      this.pageDataReq();
    },
    methods: {
      cp,
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
                  this.taskTypesView = res.data;
                  this.taskTypes = this.taskTypes.filter(item => {
                    return item.code != '13'
                  })
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
        this.pageDataReq();
      },

      view(id){
          this.$http.post('/work/order/view',{id}).then((response)=>{
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

                  
                  if(this.orderData.work.create_time && this.orderData.work.create_time.slice){
                    if(this.orderData.work.create_time.slice(0,4)=='1970'){
                      this.orderData.work.create_time = ''
                    }
                  };

                  if(this.orderData.work.receive_time && this.orderData.work.receive_time.slice){
                    if(this.orderData.work.receive_time.slice(0,4)=='1970'){
                      this.orderData.work.receive_time = ''
                    }
                  }; 

                  if(this.orderData.work.finish_time && this.orderData.work.finish_time.slice){
                    if(this.orderData.work.finish_time.slice(0,4)=='1970'){
                      this.orderData.work.finish_time = ''
                    }
                  }; 

                  if(this.orderData.task.task_types){
                      this.orderData.task.task_types.slice(1,-1).split(',').forEach( typeItem => {
                          this.taskTypesView.forEach(item4 => {
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
      //close
      close (row) {
        this.$prompt('确认强制关闭此工单？(确认之后会创建一个故障维修工单)', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^.{1,300}$/,
            inputErrorMessage: '备注不能为空,最多300字'
        }).then(({ value }) => {
            var req={
                workOrderId:row.id,
                remark:value,
                businessType:1,
                userId: this.user_id 
            };
            this.$http.post('/staff/staff-order/close-order', req,{type:'payload'}).then((response) => {
                var res = response.data
                if (res.errCode === 0) {
                    message(this,res.message,'success')
                    this.pageDataReq()
                } else {
                    message(this,res.message,'error')
                }
            })
        }).catch((err) => {      
          console.log(err)
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
                  this.editForm.workOrder.taskList[0].taskId = res.data.task.taskId;
                  this.editForm.workOrder.userId = res.data.work.user_id;

                  this.editForm.workOrder.createUserId = res.data.work.create_user_id;

                  if(res.data.task.task_types){
                    this.editForm.workOrder.taskList[0].taskType = res.data.task.task_types.slice(1,-1);
                    if (this.editForm.workOrder.taskList[0].taskType == '13') {
                      this.editForm.workOrder.taskList[0].taskType = ''
                    }
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

          if(data.workOrder.distributeType==''){
            message(this,'派单方式不能为空','error');
            return;
          }

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
        
          if(data.workOrder.taskList[0].instruction.length>200){
            message(this,'任务描述字数不能超过200','error');
            return;
          }

          // if(data.workOrder.taskList[0].taskType == '1' || data.workOrder.taskList[0].taskType == '8'){
          //   data.workOrder.isOnline = '0'
          // }

          data.workOrder = JSON.stringify(data.workOrder);

          
          
          this.$http.post('/staff/staff-order/update-order',data).then((response)=>{
              var res = response.data;
              if(res.errCode === 0){
                this.editDialog = false;
                this.pageDataReq()
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
                  businessType:1,
                  userId:this.user_id
              };
              this.$http.get('/staff/staff-order/revokeWorkOrder', {params:req},{type:'payload'}).then((response) => {
                  var res = response.data;
                  if (res.errCode === 0) {
                      message(this,res.message,'success')
                      this.pageDataReq();
                  } else {
                      message(this,res.message,'error')
                  }
              })
          }).catch(() => {      
          });
      },
      refresh(){
        for(let i in this.filterForm){
          if(i!='page' && i!='pageSize'){
            this.filterForm[i] = ''
          }
        }
        this.filterForm.page = 1;
        this.page = 1;
        this.pageDataReq();
      },
      //获取数据
      pageDataReq() {
        this.$store.dispatch('loadingAction', true);
        let data = {}, copyData = _.cloneDeep(this.filterForm);
        data.page = this.filterForm.page;
        data.pageSize = this.filterForm.pageSize;

        if(this.sorts){
          data.sort = this.sorts;
        }else{
          data.sort = 'id&desc'
        }
        
        
        data.role_id = this.role_id;
        if(copyData.status === 'all'){
          copyData.status = '';
        }

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

        if(copyData.finish_time!=null && copyData.finish_time[0]){
          copyData.finish_time = copyData.finish_time[0]/1000+'--'+copyData.finish_time[1]/1000;
        }else{
          copyData.finish_time = ''
        }

        if(copyData.modify_time!=null && copyData.modify_time[0]){
          copyData.modify_time = copyData.modify_time[0]/1000+'--'+copyData.modify_time[1]/1000;
        }else{
          copyData.modify_time = ''
        }

        

        delete copyData.page;
        delete copyData.pageSize;
      
        data.where = qs.stringify(copyData);
        this.where = qs.stringify(copyData);
        
        HTTP.getWorkOrderList(this.reqUrl, data).then((response) => {
          this.$store.dispatch('loadingAction', false);
          var res = response;
          if (res.code === 200) {
            this.tableData = res.data.data;
            this.total = parseInt(res.data.total);
          } else {
            this.tableData = [];
            this.page = 1;
          }
        }).catch(err => {
          this.$store.dispatch('loadingAction', false);
        })
      },
      handleData () {
        this.tableData.forEach(item => {
          if(item.receive_time && item.receive_time.slice){
            if(item.receive_time.slice(0,4)=='1970'){
              item.receive_time = ''
            }
          };
          if(item.finish_time && item.finish_time.slice){
            if(item.finish_time.slice(0,4)=='1970'){
              item.finish_time = ''
            }
          };

          let flag = true;
          this.cityList.forEach(item2 => {
            if(item.area_code == item2.baiduid){
              item.area_code = item2.cityname
              flag = false;
            }
          })
          if(flag){
            item.area_code = ''
          }

        })
      },
      //tab状态改变
      statusChange(){
       
        this.filterForm = this.filterForms[this.reqUrl];
        this.filterForm.page = 1;
        this.page = this.filterForm.page;
        this.pageDataReq();
      },
      //切换分页
      handleCurrentChange(val) {
        // this.page = val;
        this.filterForms[this.reqUrl].page = val;
        this.pageDataReq();
      },
      //展开隐藏搜索
      filterFormSwitch(swi) {
        this.isShowFilterForm = swi;
      },
      //搜索与重置
      search(swi) {
        if (swi) {
          this.filterForm.page = 1;
          this.page = 1;
          this.pageDataReq();
        } else {
          for (let i in this.filterForm) {
            if (i != 'pageSize' && i != 'page') {
              this.filterForm[i] = ''
            }
          }
        }
      },
      //查找车辆信息
      searchCarInfo(){
        var req={
          keywords:this.keywords
        }
        this.$http.post('/work/order/search-car',req).then(({data})=>{
          if(data.code==200){
            this.addCarInfo=[data.data];
           
            this.addEditForm.workOrder.carId = this.addCarInfo[0].id;
           
          }else {
            this.$message.error(data.message);
          }
        })
      },
      //新增
      append() {
        this.addEditDialog = true;
        this.title = '新增';
        this.addEditForm.workOrder.createUserId = this.user_id;
        this.addEditForm.workOrder.instruction = '';
        this.addEditForm.workOrder.distributeType = '2';
        this.addEditForm.workOrder.userId = '';
        this.addEditForm.workOrder.taskList[0].taskType = '';
        this.addEditForm.workOrder.taskList[0].instruction = '';

        this.addEditForm.workOrder.carId = '';
        this.keywords = '';
        this.addCarInfo = [];
      },

      addEditFinish() {
        let url, msg, data = _.cloneDeep(this.addEditForm);
        if (this.title === '新增') {
          url = '/staff/staff-order/new-order';
        } else {
          url = '';
        }
        data.workOrder.taskList[0].instruction = data.workOrder.instruction;

        if(data.workOrder.carId == ''){
          message(this,'请先搜索匹配车辆信息','error');
          return;
        }
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

        if(data.workOrder.taskList[0].instruction.length>200){
          message(this,'任务描述字数不能超过200','error');
          return;
        }
        if(data.workOrder.distributeType=='2'){
          delete data.workOrder.userId
        }
        // if(data.workOrder.taskList[0].taskType == '1' || data.workOrder.taskList[0].taskType == '8'){
        //   data.workOrder.isOnline = '0'
        // }

        data.workOrder = JSON.stringify(data.workOrder);
        
        if(this.flag){
          this.flag = false;
          this.$http.post(url, data).then((response) => {
            this.flag = true;
            var res = response.data;
            this.addEditDialog = false;
            if (res.errCode == 0) {
              this.pageDataReq();
              message(this, res.message, 'success')
            } else {
              message(this, res.message, 'error')
            }
          }).catch( err => {
            console.log(err);
            this.flag = true;
          })
        }
        
      },
      //导出
      exportExel(type){
          let url = '', req, staus, title, props, data;
          switch(this.reqUrl)
          {
            case '/work/order/list':
              status = -1
              title = ['ID','城市','工单号','工单状态','任务类型','车型','车牌号','地服姓名','地服手机号','地府所属地府供应商','下单时间','接单时间','完成时间','工单行驶里程（km）','接单方式','关单方式']
              props=['id','area_code','order_num','status','task_types','brand','license_tag','full_name','phone_num','user_company_id','create_time','receive_time','finish_time','travel_mileage','recive_type','close_type']
              break;
            case '/work/order/list-send':
              status = 0
              title = ['ID','城市','工单号','工单状态','任务类型','车型','车牌号','地服姓名','地服手机号','地府所属地府供应商','下单时间','工单行驶里程（km）','接单方式','关单方式']
              props=['id','area_code','order_num','status','task_types','brand','license_tag','full_name','phone_num','user_company_id','create_time','travel_mileage','recive_type','close_type']
              break;
            case '/work/order/list-doing':
              status = 10
              title = ['ID','城市','工单号','工单状态','任务类型','车型','车牌号','地服姓名','地服手机号','地府所属地府供应商','下单时间','接单时间','工单行驶里程（km）','接单方式','关单方式']
              props=['id','area_code','order_num','status','task_types','brand','license_tag','full_name','phone_num','user_company_id','create_time','receive_time','travel_mileage','recive_type','close_type']
              break;
            case '/work/order/list-finish':
              status = 15
              title = ['ID','城市','工单号','工单状态','任务类型','车型','车牌号','地服姓名','地服手机号','地府所属地府供应商','下单时间','接单时间','完成时间','工单行驶里程（km）','接单方式','关单方式']
              props=['id','area_code','order_num','status','task_types','brand','license_tag','full_name','phone_num','user_company_id','create_time','receive_time','finish_time','travel_mileage','recive_type','close_type']
              break;
            case '/work/order/list-repeal':
              status = 20
              title = ['ID','城市','工单号','工单状态','任务类型','车型','车牌号','地服姓名','地服手机号','地府所属地府供应商','下单时间','撤销时间','工单行驶里程（km）','接单方式','关单方式']
              props=['id','area_code','order_num','status','task_types','brand','license_tag','full_name','phone_num','user_company_id','create_time','modify_time','travel_mileage','recive_type','close_type']
              break;
            case '/work/order/list-cancel':
              status = 30
              title = ['ID','城市','工单号','工单状态','任务类型','车型','车牌号','地服姓名','地服手机号','地府所属地府供应商','下单时间','接单时间','取消时间','工单行驶里程（km）','接单方式','关单方式']
              props=['id','area_code','order_num','status','task_types','brand','license_tag','full_name','phone_num','user_company_id','create_time','receive_time','modify_time','travel_mileage','recive_type','close_type']
              break;
            default:
              status = -1
              title = ['ID','城市','工单号','工单状态','任务类型','车型','车牌号','地服姓名','地服手机号','地府所属地府供应商','下单时间','接单时间','完成时间','工单行驶里程（km）','接单方式','关单方式']
              props=['id','area_code','order_num','status','task_types','brand','license_tag','full_name','phone_num','user_company_id','create_time','receive_time','finish_time','travel_mileage','recive_type','close_type']
          }
          if(type == 1){
              url = '/work/order/export';
              req = {role_id:this.role_id,where:this.where,status}
          }else{
              url = '/work/order/exports';
              req = {role_id:this.role_id,status}
          }
          
          this.$store.dispatch('loadingAction', true);
          this.$http.post(url,req,{type:'payload'}).then((response) => {
              this.$store.dispatch('loadingAction', false);
              let res = response.data;
              if(res.code == 200){
                  if(res.data.length===0){
                    message(this,'无可导出数据','error')
                  }else{
                    data = res.data
                    data.forEach(item => {
                      if(item.receive_time && item.receive_time.slice){
                        if(item.receive_time.slice(0,4)=='1970'){
                          item.receive_time = ''
                        }
                      };
                      if(item.finish_time && item.finish_time.slice){
                        if(item.finish_time.slice(0,4)=='1970'){
                          item.finish_time = ''
                        }
                      };
                      if(item.create_time && item.create_time.slice){
                        if(item.create_time.slice(0,4)=='1970'){
                          item.create_time = ''
                        }
                      };
                      if(item.modify_time && item.modify_time.slice){
                        if(item.modify_time.slice(0,4)=='1970'){
                          item.modify_time = ''
                        }
                      };
                      if (item.status === '0') {
                        item.status = '已发未接'
                      } else if (item.status === '10') {
                        item.status = '进行中'
                      } else if (item.status === '15') {
                        item.status = '已完成'
                      } else if (item.status === '20') {
                        item.status = '已取消'
                      } else if (item.status === '30') {
                        item.status = '已撤销'
                      }

                      if (item.recive_type == '1') {
                        item.recive_type = '派单'
                      } else if (item.recive_type === '2') {
                        item.recive_type = '搜索'
                      } else if (item.recive_type === '3') {
                        item.recive_type = '专单'
                      } else if (item.recive_type === '4') {
                        item.recive_type = '其他'
                      }

                      if (item.close_type == '1') {
                        item.close_type = '正常关单'
                      } else if (item.close_type === '2') {
                        item.close_type = '手机端强制关单'
                      } else if (item.close_type === '3') {
                        item.close_type = '后台强制关单'
                      } else if (item.close_type === '4') {
                        item.close_type = '转移工单'
                      }
                      
                      item.task_types = this.workOrderType[item.task_types.slice(1,-1)]
                      item.user_company_id = this.companyList[item.user_company_id]
                      let flag = true;
                      this.cityList.forEach(item2 => {
                        if(item.area_code == item2.baiduid){
                          item.area_code = item2.cityname
                          flag = false;
                        }
                      })
                      if(flag){
                        item.area_code = ''
                      }
                    })
                    exportExcel('工单列表',title,props,data);
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
    props: {}
  }
</script>
<style lang="less">
  .work-order {
    .search-form .el-form--inline .el-form-item__label{
      text-align: right
    }
    .el-form-item__content > div {
      width: 80%;
    }
    .el-form-item__content .el-button {
      width: 80%;
    }
    // .el-form-item__content {
    //   height: 40px !important;
    // }
    .el-form-item {
      margin-bottom: 0 !important;
    }
  }

  .filter-form {
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
    height: 300px;
  }

  .el-form--inline .el-form-item__label {
    text-align: left
  }

  .el-dialog {
    width: 70%;
  }
</style>
