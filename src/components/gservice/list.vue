<template>
    <div class="gserver-list">
        <div style="margin-bottom: 20px" >
            <el-button size="mini" v-if="cp('--/staff/user/add')" type="primary" @click="append">增加</el-button>
            <el-button size="mini" v-if="cp('--/staff/user/massAdd')" type="primary" @click="$router.push('/gservice/add')">批量导入</el-button>
            <el-button size="mini" type="text" v-show="!isShowFilterForm" @click="filterFormSwitch(true)">展开</el-button>
        </div>

        <el-row class="filter-form" v-show="isShowFilterForm">
            <el-row>
                <el-button size="text" style="font-size:12px;" @click="filterFormSwitch(false)">隐藏</el-button>
            </el-row>
            <el-col :span="18" class="search-form">
                <el-form :model="filterForm" :inline="true" label-width="100px">
                    <el-form-item label="姓名">
                        <el-input v-model="filterForm.name" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="驾照档案编号">
                        <el-input v-model="filterForm.driver_license_file_no" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="filterForm.phone_num" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号">
                        <el-input v-model="filterForm.identity_card_num" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="业务类型">
                        <sourceSelect
                            :valProp.sync="filterForm.order_type"
                            url="/ground/staff/order-type-all"
                            :config="oConfig" />
                    </el-form-item>
                    <el-form-item label="所属地服供应商">
                        <sourceSelect
                            :valProp.sync="filterForm.ground_service_company_id"
                            url="/ground/staff/ground-service-all"
                            :config="cConfig" />
                    </el-form-item>
                    <el-form-item label="账号状态">
                        <el-select
                        clearable
                        v-model="filterForm.status"
                        style="width:155px"
                        size="small"
                        placeholder="请选择">
                            <el-option label="启用" value="10"></el-option>
                            <el-option label="禁用" value="20"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务城市">
                        <sourceSelect
                            :valProp.sync="filterForm.area_code"
                            url="/city/city/all"
                            :config="cityConfig" />
                    </el-form-item>

                </el-form>
            </el-col>
            <el-col :span="6" style="margin-top:10px">
                <el-button size="mini" type="primary" @click="search(true)">搜索</el-button>
                <el-button size="mini" @click="search(false)">重置</el-button>
                <el-button size="mini" @click="refresh">刷新</el-button>
            </el-col>
        </el-row>
        <div>
            <el-button size="mini" v-if="cp('--/ground/staff/export')" type="primary" @click="exportExel(1)">导出当前列表</el-button>
            <el-button size="mini" v-if="cp('--/ground/staff/exports')" type="primary" @click="exportExel(2)">导出全部列表</el-button>
            <el-table
                :data="tableData"
                :default-sort="{prop: 'id', order: 'descending'}"
                @sort-change="sortChange"
                border
                style="width: 100%;margin-top:20px;">
                <el-table-column
                    label="操作"
                    fixed
                    width="120">
                    <template slot-scope="scope">
                        <el-button size="mini" style="margin-left:10px;margin-bottom:10px" v-if="cp('--/ground/staff/view')" type="primary" @click="view(scope.row.id)">查看</el-button>

                        <el-button size="mini" style="margin-left:10px;margin-bottom:10px" v-if="cp('--/staff/user/update')" type="primary" @click="edit(scope.row.id)">修改</el-button>

                        <el-button size="mini" style="margin-bottom:10px" v-if="cp('--/staff/user/updateStatus')" type="warning" @click="forbidden(scope.row)">
                            <span v-if="scope.row.status==10">禁用</span>
                            <span v-else>启用</span>
                        </el-button>

                        <el-button size="mini" style="margin-bottom:10px" v-if="cp('--staff/work/order/view')" type="primary" @click="viewOrder(scope.row.phone_num)">工单记录</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    
                    width="100"
                    label="配置">
                    <template slot-scope="scope">
                        <el-button size="mini" v-if="cp('--/staff/user/updateType')" type="primary" @click="config(scope.row)">业务类型</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    
                    label="ID"
                    prop="id">
                </el-table-column>
                <el-table-column
                    
                    label="姓名"
                    prop="name">
                </el-table-column>
                <el-table-column
                    label="手机号"
                    prop="phone_num">
                </el-table-column>
                <el-table-column
                                    
                    label="城市"
                    prop="area_code">
            
                </el-table-column>
                <el-table-column
                    
                    label="地服供应商名称"
                    prop="full_name">
                </el-table-column>
                <el-table-column
                    sortable="custom"
                    prop="create_time"
                    label="创建时间">
                </el-table-column>

                <el-table-column
                   
                    sortable="custom"
                    prop="modify_time"
                    label="禁用时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==20">{{scope.row.modify_time}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column
                    prop="status"
                    label="账号状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==10">启用</span>
                        <span v-else>禁用</span>
                    </template>
                </el-table-column>
                
                <el-table-column
                    min-width="300"
                    label="业务类型"
                    prop="order_type"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row.order_type|typeFilter(orderTypeAlls)}}</span>
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
        <el-dialog :title="title" :close-on-press-escape="false" :visible.sync="viewDialog">
            <el-form :model="viewForm"  :label-width="'120px'" :inline="true">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名">
                            <span>{{viewForm.name}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号">
                            <span>{{viewForm.phoneNum}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证号">
                            <span>{{viewForm.identityCardNum}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="驾照档案编号">
                            <span>{{viewForm.driverLicenseFileNo}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="准驾车型">
                            <span>{{driverLevel[viewForm.driverLicenseLevel]}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="驾驶证到期日期">
                            <span>{{viewForm.driverLicenseValid}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属地服供应商">
                            <span>{{viewForm.groundServiceCompanyId}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属城市">
                            <span>{{viewForm.areaCode}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>

                    <el-form-item label="服务区域">
                        <div>
                            <el-tag style="margin-right:10px" v-for="item in viewForm.townCode" :key="item">{{item}}</el-tag>
                        </div>
                    </el-form-item>

                </el-row>

                <el-row>

                    <el-form-item label="业务类型">
                        <div>
                            <el-tag style="margin-right:10px" v-for="item in viewForm.orderType" :key="item">{{item}}</el-tag>
                        </div>
                    </el-form-item>

                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证正面图片">
                            <div  id="idCarR">
                                <!-- <imagePreviewDelete :backgroundPicUrl="picUrl+viewForm.idCardImg[0]" /> -->
                                <picpreview v-show="viewForm.idCardImg[0]" :backgroundPicUrl="picUrl+viewForm.idCardImg[0]"/>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证反面图片">
                            <div id="idCarW">
                                <!-- <imagePreviewDelete :backgroundPicUrl="picUrl+viewForm.idCardImg[1]" /> -->
                                <picpreview v-show="viewForm.idCardImg[1]" :backgroundPicUrl="picUrl+viewForm.idCardImg[1]"/>
                            </div>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="驾驶证正本图片">
                            <div id="drR">
                                <!-- <imagePreviewDelete :backgroundPicUrl="picUrl+viewForm.idCardImg[1]" /> -->
                                <picpreview v-show="viewForm.driverLicenseImg[0]" :backgroundPicUrl="picUrl+viewForm.driverLicenseImg[0]"/>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="驾驶证副本图片">
                            <div id="drW">
                                <!-- <imagePreviewDelete :backgroundPicUrl="picUrl+viewForm.idCardImg[1]" /> -->
                                <picpreview v-show="viewForm.driverLicenseImg[1]" :backgroundPicUrl="picUrl+viewForm.driverLicenseImg[1]"/>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>


        <!--增加-->
        <el-dialog class="add" :title="title" :close-on-press-escape="false" :visible.sync="addEditDialog" :before-close="beforeClose">
            <el-form :model="addEditForm" ref="addEditForm" :label-width="'120px'" :rules="rules" :inline="true">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input  placeholder="必须是中文" v-model="addEditForm.name" size="small" style="width:200px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="phoneNum">
                            <el-input  v-model="addEditForm.phoneNum" size="small" style="width:200px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证号" prop="identityCardNum">
                            <el-input  v-model="addEditForm.identityCardNum" size="small" style="width:200px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="驾照档案编号" prop="driverLicenseFileNo">
                            <el-input  v-model="addEditForm.driverLicenseFileNo" size="small" style="width:200px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="准驾车型" prop="driverLicenseLevel">
                            <el-select
                            
                            v-model="addEditForm.driverLicenseLevel"
                            clearable
                            size="small"
                            style="width:200px">
                                <el-option v-for="(item,index) in driverLevel" :key="index" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="驾驶证到期日期" prop="driverLicenseValid">
                            <el-date-picker
                                
                                style="width:200px"
                                size="small"
                                value-format="yyyy-MM-dd"
                                v-model="addEditForm.driverLicenseValid"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属地服供应商" prop="groundServiceCompanyId">
                            <el-select  v-model="addEditForm.groundServiceCompanyId" size="small" style="width:200px">
                                <el-option v-for="item in companyList" :key="item.id" :label="item.full_name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属城市" prop="areaCode">
                            <el-select  v-model="addEditForm.areaCode" multiple @change="areaCodeChange($event)" size="small" style="width:200px">
                                <el-option v-for="item in cityList" :key="item.baiduid" :label="item.cityname" :value="item.baiduid"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>

                    <el-form-item label="业务类型" prop="orderType">
                        <div>
                            <el-checkbox v-model="orderTypeAll"  @change="selectAllOrder($event,'addEditForm')">全部</el-checkbox>
                            <el-checkbox-group
                                @change="orderTypeChange('addEditForm')"
                                v-model="addEditForm.orderType">
                                <el-checkbox
                                    v-for="item in orderType"
                                    :key="item.code"
                                    :label="item.code">
                                    {{item.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>

                </el-row>

                <el-row>

                    <el-form-item label="服务区域" prop="selectCity">
                        <div>
                            <el-checkbox-group
                                @change="selectCityChange($event)"
                                v-model="addEditForm.selectCity">
                                <el-checkbox
                                    v-for="item in selectCityList"
                                    :key="item.baiduid"
                                    :label="item.baiduid">
                                    {{item.cityname}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div>
                            <el-checkbox-group
                                @change="townCodeChange($event)"
                                v-model="addEditForm.townCode">
                                <el-checkbox
                                    v-for="item in areaList"
                                    :key="item.areacode"
                                    :label="item.areacode">
                                    {{item.areaname}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>

                </el-row>



                <el-row v-if="title=='修改'">
                    <el-col :span="12">
                        <el-form-item label="身份证正面图片">

                            <div  id="idCarRE">
                                <picpreview v-show="addEditForm.idCardImg[0]" :backgroundPicUrl="picUrl+addEditForm.idCardImg[0]"/>
                            </div>
                      
                         
                            <imgUpload :userId="user_id" :iRef="iRef" @uploadSuccess="uploadSuccess"/> 
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证反面图片">
                            <div id="idCarWE">
                                <picpreview v-show="addEditForm.idCardImg[1]" :backgroundPicUrl="picUrl+addEditForm.idCardImg[1]"/>
                            </div>
                           
                            <imgUpload :userId="user_id" :iRef="iRefT" @uploadSuccess="uploadSuccess"/> 
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row v-if="title=='修改'">
                    <el-col :span="12">
                        <el-form-item label="驾驶证正本图片">
                            

                            <div id="drRE">
                                <picpreview v-show="addEditForm.driverLicenseImg[0]" :backgroundPicUrl="picUrl+addEditForm.driverLicenseImg[0]"/>
                            </div>

                            <imgUpload :userId="user_id" :iRef="dRef" @uploadSuccess="uploadSuccess"/> 
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="驾驶证副本图片">
                           
                            <div id="drWE">
                                <!-- <imagePreviewDelete :backgroundPicUrl="picUrl+viewForm.idCardImg[1]" /> -->
                                <picpreview v-show="addEditForm.driverLicenseImg[1]" :backgroundPicUrl="picUrl+addEditForm.driverLicenseImg[1]"/>
                            </div>
                            <imgUpload :userId="user_id" :iRef="dRefT" @uploadSuccess="uploadSuccess"/> 
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>

            <div slot="footer" class="dialog-footer" v-show="title!='查看'">
                <el-button @click="beforeClose">取消</el-button>
                <el-button type="primary" :loading="bLoading" @click="addEditFinish('addEditForm')">确定</el-button>
            </div>
        </el-dialog>

        <!--业务类型-->
        <el-dialog :title="title" class="add" :visible.sync="TypeDialog">
            <el-form :model="editTypeForm" :label-width="'120px'" :inline="true">

                        <el-form-item label="地服信息">

                        </el-form-item>
                        <el-table
                                :data="tableDataType"
                                border
                                style="width: 100%;margin-top:20px;">
                                <el-table-column
                                    
                                    label="姓名"
                                    prop="name">
                                </el-table-column>
                                <el-table-column
                                    label="手机号"
                                    prop="phone_num">
                                </el-table-column>
                                <el-table-column
                                    
                                    label="地服供应商名称"
                                    prop="full_name">
                                </el-table-column>
                                <el-table-column
                                    
                                    label="城市"
                                    prop="area_code">
                            
                                </el-table-column>
                                <el-table-column
                                    prop="status"
                                    label="状态">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.status==10">启用</span>
                                        <span v-else>禁用</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    
                                    prop="create_time"
                                    label="创建时间">
                                </el-table-column>
                            </el-table>
                        <el-form-item label="业务类型" style="margin-top:40px">
                            <div style="margin-left:120px">
                                <el-checkbox v-model="orderTypeAll" @change="selectAllOrder($event,'editTypeForm')">全部</el-checkbox>
                                <el-checkbox-group
                                    @change="orderTypeChange('editTypeForm')"
                                    v-model="editTypeForm.orderType">
                                    <el-checkbox
                                        v-for="item in orderType"
                                        :key="item.code"
                                        :label="item.code">
                                        {{item.name}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="TypeDialog = false">取消</el-button>
                <el-button type="primary" :loading="bLoading" @click="configFinish">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import qs from 'qs'
    import message from '../../assets/js/message';
    import picpreview from '../common/picpreview';
    import imagePreviewDelete from '../common/imagePreviewDelete';
    // import picpreview from '../common/picpreview';
    import sourceSelect from '../common/sourceSelect';
    import {DOWN_URL,picUrl} from '../../config/app';
    import cp from '../../utils/checkPermissions';
    import exportExcel from '../../assets/js/exportExcel';
    import imgUpload  from '../common/imgUpload';
    
    export default {
        
        components:{
            picpreview,
            sourceSelect,
            imagePreviewDelete,
            imgUpload 
        },
        data() {
            var checkDriverLicenseFileNo = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('驾照档案编号'));
                }
                var reg=/[\u2E80-\u9FFF]+/g;
                if(value.length>40 || reg.test(value)){
                    return callback(new Error('长度不应大于40位的字符'));
                }
                callback();
            };
            var checkIdentityCardNum = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('身份证号不能为空'));
                }
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
                if(!reg.test(value)){
                    return callback(new Error('身份证号格式错误'));
                }
                callback();
            };
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('姓名不能为空'));
                }
                
                var reg=/^[\u2E80-\u9FFF]+$/;//Unicode编码中的汉字范围
                if(!reg.test(value) || value.length>20){
                    return callback(new Error('姓名必须是中文且长度不大于20'));
                }
                callback();
            };
            var checkMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号不能为空'));
                }
                
                var reg=/^1[3|4|5|7|8|9][0-9]\d{8}$/;
                if(!reg.test(value)){
                    return callback(new Error('手机号格式错误'));
                }
                callback();
            };
            var checkDriverLicenseLevel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('准考驾型不能为空'));
                }
                callback();
            }; 
            var checkDriverLicenseValid = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('驾驶证到期日期不能为空'));
                }
                callback();
            };
            var checkGroundServiceCompanyId = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('所属地服供应商不能为空'));
                }
                callback();
            };
            var checkAreaCode = (rule, value, callback) => {
                
                if (value.length<=0) {
                    return callback(new Error('所属城市不能为空'));
                }
                callback();
            };

            var checkOrderType = (rule, value, callback) => {
                if (value.length<=0) {
                    return callback(new Error('业务类型不能为空'));
                }
                callback();
            };
            var checkSelectCity = (rule, value, callback) => {
                if (value.length === 0) {
                    return callback(new Error('请选择区域'));
                }
                if (value.length<this.selectCityList.length) {
                    return callback(new Error('每个城市下至少有一个对应区'));
                }
                callback();
            }
            
            return {
                picUrl,
                bLoading:false,
                iRef:'idCardInput',
                iRefT:'idCardInputT',
                dRef:'driverLicenseImg',
                dRefT:'driverLicenseImgT',
                rules: {
                    driverLicenseFileNo: [
                        { validator: checkDriverLicenseFileNo, trigger: 'blur', required:true }
                    ],
                    identityCardNum: [
                        { validator: checkIdentityCardNum, trigger: 'blur', required:true }
                    ],
                    name:[
                        { validator: checkName, trigger: 'blur', required:true }
                    ],
                    phoneNum:[
                        { validator: checkMobile, trigger: 'blur', required:true }
                    ],
                    driverLicenseLevel:[
                        { validator: checkDriverLicenseLevel, trigger: 'change', required:true }
                    ],
                    driverLicenseValid:[
                        { validator: checkDriverLicenseValid, trigger: 'change', required:true }
                    ],
                    groundServiceCompanyId:[
                        { validator: checkGroundServiceCompanyId, trigger: 'change', required:true }
                    ],
                    areaCode:[
                        { validator: checkAreaCode, trigger: 'change', required:true }
                    ],
                    orderType:[
                        { validator: checkOrderType, trigger: 'change', required:true }
                    ],
                    selectCity:[
                        { validator: checkSelectCity, trigger: 'change', required:true }
                    ]
                },
                page: 1,//当前也
                total:0,//总数
                tableData: [],//列表数据
                orderType:[],
                orderTypeAlls:[],
                driverLevel:{},
                cityList:[],
                areaList:[],
                selectCityList:[],
                areaCodeCope:[],
                companyList:[],
                reqUrl:'/ground/staff/list',
                addEditDialog:false,
                TypeDialog:false,
                title:'',
                where:'',
                cConfig:['id','full_name','data'],
                cityConfig:['baiduid','cityname','data'],
                oConfig:['code','name','data'],
                typeOption:[],
                filterForm:{
                    page:1,
                    pageSize:10,
                    name:'',
                    driver_license_file_no:'',
                    phone_num:'',
                    identity_card_num:'',
                    order_type:'',
                    ground_service_company_id:'',
                    status:'',
                    area_code:''
                },
                isShowFilterForm:true,
                viewDialog:false,
                viewForm:{
                    name:'',
                    phoneNum:'',
                    identityCardNum:'',
                    driverLicenseFileNo:'',
                    driverLicenseLevel:'',
                    driverLicenseValid:'',
                    groundServiceCompanyId:'',
                    areaCode:[],
                    orderType:[],
                    idCardImg:[],
                    townCode:[],
                    driverLicenseImg:[]
                },
                
                editTypeForm:{
                    id:'',
                    orderType:[],
                   
                },
                tableDataType:[],
                orderTypeAll:false,
                addEditForm:{
                    id:'',
                    name:'',
                    phoneNum:'',
                    identityCardNum:'',
                    driverLicenseFileNo:'',
                    driverLicenseLevel:'',
                    driverLicenseValid:'',
                    groundServiceCompanyId:'',
                    areaCode:[],
                    selectCity:[],
                    orderType:[],
                    idCardImg:[],
                    townCode:[],
                    driverLicenseImg:[]
                },
                sorts:'',
                user_id:''
            }
        },
        created(){
            this.getAfter().then((res) => {
            })
        },
        mounted() {
            this.pageDataReq();
            this.getDriverLevel();
            this.initCity();
            this.initCompany();
            this.init();
        },
        computed: {
            test:function () {
                this.cityList
                this.tableData
                return this
            }
        },
        watch: {
            test(){
                if(this.tableData.length>0 && this.cityList.length>0){
                    this.handleDate()
                }
            }
        },
        filters:{
            typeFilter(val,data){
                // console.log(data)
                if(val){
                    let arr = []
                    val.split(',').forEach(item1 => {
                        data.forEach(item2 => {
                            if(item1 == item2.code){
                                arr.push(item2.name)
                            }
                        })
                    });
                    return arr.join(',');
                }else{
                    return ''
                }
            }
        },
        methods: {
            cp,
            init(){
                let u = localStorage._MyDaDao_user_data,user_id;
                if(u){
                    this.user_id = JSON.parse(u).user_id;
                }
            },
            handleDate(){
                this.tableData.forEach(tItem => {
                    let cityArr = [],cityIdArr = tItem.area_code.split(',');
                    this.cityList.forEach(item => {
                        cityIdArr.forEach(idItem => {
                            if(item.baiduid == idItem){
                                cityArr.push(item.cityname) 
                            }
                        })
                        
                    });
                    tItem.area_code = cityArr.join(',');
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
            //获取数据
            pageDataReq() {
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

                data.where = qs.stringify(copyData);
                this.where = qs.stringify(copyData);
            
                this.$http.post(this.reqUrl,data,).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                    if (res.code === 200) {
                        this.tableData = res.data.data;
                        this.total=parseInt(res.data.total);
                    }else {
                        this.tableData=[];
                        this.page=1;
                    }
                }).catch(err => {
                    console.log(err);
                    this.$store.dispatch('loadingAction',false);
                })
            },
            //获取订单类型数据
            getOrderType(){
                return this.$http.post('/ground/staff/order-type-all').then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.orderType = res['data'];
                        this.orderTypeAlls = res['data'];
                        this.orderType = this.orderType.filter(item => {
                            return item.code != 13
                        })
                        return new Promise((resolve,reject) => {
                            resolve(this.orderType);
                        })
                    }
                })
            },
            async getAfter() {
                return await this.getOrderType();
            },
            //获取驾照等级
            getDriverLevel(){
                return this.$http.post('/ground/staff/driver-level').then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.driverLevel = res['data'];
                    }
                })
            },
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
            diff(arr1, arr2) {  
                let newArr = [];  
                let arr3 = [];
                let flag;
                flag = arr1.length < arr2.length ? 1:-1  
                for (let i=0;i<arr1.length;i++) {  
                    if(arr2.indexOf(arr1[i]) === -1)     
                    arr3.push(arr1[i]);  
                }  
                let arr4 = [];  
                for (let j=0;j<arr2.length;j++) {  
                    if(arr1.indexOf(arr2[j]) === -1)  
                    arr4.push(arr2[j]);  
                }  
                newArr = arr3.concat(arr4);  
                return {diff: newArr, flag}  
            },  
            areaCodeChange (data) {// 下拉框城市change
                let diff = this.diff(this.areaCodeCope, data)
                let selectCitySet = new Set(this.addEditForm.selectCity)
                let townCodeSet = new Set(this.addEditForm.townCode)
             
                this.areaList = [] //区域列表
                this.selectCityList = [] //已选城市列表

                data.forEach(item => {
                    this.cityList.forEach(cityItem => {
                        if (item === cityItem.baiduid) {
                            this.selectCityList.push(cityItem)
                            this.areaList.push(...cityItem.area)
                        }
                    })
                })
                diff.diff.forEach(item => {
                    if (diff.flag > 0) {
                        selectCitySet.add(item)
                    } else {
                        selectCitySet.delete(item)
                    }
                    this.cityList.forEach(cityItem => {
                        if (item === cityItem.baiduid) {
                        
                            for (let arr of cityItem.area) {
                                if (diff.flag > 0) {
                                    townCodeSet.add(arr.areacode)
                                } else {
                                    townCodeSet.delete(arr.areacode)
                                }
                            }
                        }
                    })
                })
                this.addEditForm.selectCity = Array.from(selectCitySet)
                this.addEditForm.townCode = Array.from(townCodeSet) 
               
                this.selectCityCopy = _.cloneDeep(this.addEditForm.selectCity)
                this.areaCodeCope = _.cloneDeep(this.addEditForm.areaCode)
            },
            selectCityChange (data) {// 多选框城市change
                let diff = this.diff(this.selectCityCopy, data)
                let townCodeSet = new Set(this.addEditForm.townCode)
                diff.diff.forEach(item => {
                    this.cityList.forEach(cityItem => {
                        if (item === cityItem.baiduid) {
                            cityItem.area.forEach(areacodeItem => {
                                if (diff.flag > 0) {
                                    townCodeSet.add(areacodeItem.areacode)
                                } else {
                                    townCodeSet.delete(areacodeItem.areacode)
                                }
                            })
                        }
                    })
                })
                this.addEditForm.townCode = Array.from(townCodeSet)
                this.selectCityCopy = _.cloneDeep(this.addEditForm.selectCity)
            },
            townCodeChange (data) {// 区多选框change
                let selectCitySet = new Set()
                data.forEach(townCodeItem => {
                    this.selectCityList.forEach(selectCityItem => {
                        selectCityItem.area.forEach(areaItem => {
                            if (townCodeItem === areaItem.areacode) {
                                selectCitySet.add(selectCityItem.baiduid)
                            }
                        })
                    })
                })
                this.addEditForm.selectCity = Array.from(selectCitySet)
                this.selectCityCopy = _.cloneDeep(this.addEditForm.selectCity)
            },
            initCompany(){
                this.$http.post('/ground/staff/ground-service-all').then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.companyList = res.data;
                    }
                })
            },
            //切换分页
            handleCurrentChange(val) {
                this.page=val;
                this.filterForm.page = val;
                this.pageDataReq();
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
                    this.pageDataReq();
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
                this.pageDataReq();
            },
            //新增
            append(){
                this.addEditDialog=true
                this.title = '新增'
                for(let i in this.addEditForm){
                    this.addEditForm[i] = typeof (this.addEditForm[i]) == 'object'? []:''
                }
                this.selectCityList = []
                this.areaList = []
                this.areaCodeCope = []
                this.orderTypeAll = false
                this.$nextTick(function () {
                    this.$refs['addEditForm'].clearValidate()
                })
                
            },
            //修改
            edit(id){
                
                this.$store.dispatch('loadingAction', true)
                this.$http.post('/ground/staff/view',{id}).then((response)=>{
                    this.$store.dispatch('loadingAction', false)
                    var res = response.data;
                    if(res.code === 200){
                        this.title = "修改";
                        this.addEditDialog = true;

                        this.$nextTick(function () {
                            this.$refs['addEditForm'].clearValidate();
                        })

                        this.addEditForm.id = id;
                        this.addEditForm.name = res.data.name;
                        this.addEditForm.phoneNum = res.data.phone_num;
                        this.addEditForm.identityCardNum = res.data.identity_card_num;
                        this.addEditForm.driverLicenseLevel = res.data.driver_license_level;
                        this.addEditForm.driverLicenseValid = res.data.driver_license_valid;
                        this.addEditForm.groundServiceCompanyId = res.data.ground_service_company_id;
                        this.addEditForm.driverLicenseFileNo = res.data.driver_license_file_no;

                        this.addEditForm.areaCode = res.data.area_code.split(',');
                        this.addEditForm.orderType = res.data.order_type.split(',');
                        let orderTypeSet = new Set(this.addEditForm.orderType)
                        orderTypeSet.delete('13')
                        this.addEditForm.orderType = Array.from(orderTypeSet)
                        this.orderTypeChange('addEditForm')

                        this.addEditForm.idCardImg = res.data.id_card_img.split(',');
                        this.addEditForm.driverLicenseImg = res.data.driver_license_img.split(',');

                        this.addEditForm.selectCity = []
                        this.areaCodeCope = []
                        this.selectCityCopy = _.cloneDeep(this.addEditForm.selectCity)
                        this.areaCodeChange(this.addEditForm.areaCode)
                        if (res.data.town_code === null) {
                            this.addEditForm.townCode = []
                        } else {
                            this.addEditForm.townCode = res.data.town_code.split(',')
                        }
                        this.townCodeChange(this.addEditForm.townCode)
                        
                        setTimeout(() => {
                            var idCarRE = new Viewer(document.getElementById('idCarRE'), {
                            url: 'data-original'
                            });
                            var idCarWE = new Viewer(document.getElementById('idCarWE'), {
                            url: 'data-original'
                            });
                            var drRE = new Viewer(document.getElementById('drRE'), {
                            url: 'data-original'
                            });
                            var drWE = new Viewer(document.getElementById('drWE'), {
                            url: 'data-original'
                            });
                        },1000)
                        
                    }
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('loadingAction', false)
                })
            },
            beforeClose(){
                this.addEditDialog = false
            },
            uploadSuccess(data){

                if(data['iRef'] == 'idCardInput'){
                    this.addEditForm.idCardImg[0] = data.res
                }else if(data['iRef'] == 'idCardInputT'){
                    this.addEditForm.idCardImg[1] = data.res
                }else if(data['iRef'] == 'driverLicenseImg'){
                    this.addEditForm.driverLicenseImg[0] = data.res
                }else{
                    this.addEditForm.driverLicenseImg[1] = data.res
                }
               
                this.addEditForm = _.cloneDeep(this.addEditForm)
            },
            addEditFinish(formName){
                let url,msg,data = _.cloneDeep(this.addEditForm);
                if(this.title === '新增'){
                    url = '/staff/user/add';
                    msg = '新增成功';
                    delete data.driverLicenseImg;
                    delete data.idCardImg;
                    delete data.id;
                }else if(this.title === '修改'){
                    url = '/staff/user/update';
                    msg = '修改成功';
                    data.driverLicenseImg = data.driverLicenseImg.join(',');
                    data.idCardImg = data.idCardImg.join(',');
                }else{
                    this.addEditDialog = false;
                }
                delete data.selectCity;
                data.orderType = data.orderType.join(',');
                data.areaCode = data.areaCode.join(',');
                data.townCode = data.townCode.join(',')

                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.bLoading = true;
                        this.$http.get(url,{params:data}).then((response)=>{
                            this.bLoading = false;
                            var res= response.data;
                            if(res.errCode == 0){
                                this.pageDataReq();
                                message(this,res.message,'success')
                                this.addEditDialog = false;
                            }else {
                                message(this,res.message,'error')
                            }
                        }).catch(err => {
                            console.log(err)
                            this.bLoading = false;
                        })
                    }else{
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            selectAllOrder(event,name){
                if(event){
                    this[name].orderType = [];
                    this.orderType.forEach(item => {
                        this[name].orderType.push(item.code);
                    })
                }else{
                    this[name].orderType = [];
                }
            },
            orderTypeChange(name){
                this.orderTypeAll = this[name].orderType.length == this.orderType.length;
            },
            view(id){
                this.$store.dispatch('loadingAction', true)
                this.$http.post('/ground/staff/view',{id}).then((response)=>{
                    this.$store.dispatch('loadingAction', false)
                    var res = response.data
                    if(res.code === 200){
                        this.title = "查看"
                        this.viewDialog = true

                        this.viewForm.name = res.data.name
                        this.viewForm.phoneNum = res.data.phone_num
                        this.viewForm.identityCardNum = res.data.identity_card_num
                        this.viewForm.driverLicenseLevel = res.data.driver_license_level
                        this.viewForm.driverLicenseValid = res.data.driver_license_valid
                        this.viewForm.groundServiceCompanyId = res.data.ground_service_company_id
                        this.viewForm.driverLicenseFileNo = res.data.driver_license_file_no
                        this.viewForm.areaCode = res.data.area_code.split(',')
                        this.viewForm.orderType = res.data.order_type.split(',')
                        this.viewForm.idCardImg = res.data.id_card_img.split(',')
                        this.viewForm.driverLicenseImg = res.data.driver_license_img.split(',')
                        if (res.data.town_code === null) {
                            this.viewForm.townCode =  []
                        } else {
                            this.viewForm.townCode =  res.data.town_code.split(',')
                        }
                        let copeCom = this.viewForm.groundServiceCompanyId
                        let townCodeArr = []
                        this.viewForm.townCode.forEach(townCodeItem => {
                            this.cityList.forEach(cityItem => {
                                cityItem.area.forEach(areaItem => {
                                    if (areaItem.areacode === townCodeItem) {
                                        // console.log(areaItem)
                                        townCodeArr.push(areaItem.areaname)
                                    }
                                })
                            })
                        })
                        this.viewForm.townCode = townCodeArr
                        this.companyList.forEach(item => {
                            if(item.id == this.viewForm.groundServiceCompanyId){
                                this.viewForm.groundServiceCompanyId = item.full_name
                            }
                        })
                        if(copeCom === this.viewForm.groundServiceCompanyId){
                            this.viewForm.groundServiceCompanyId = ''
                        }

                        let cityArr = [];
                        this.viewForm.areaCode.forEach(code => {
                            this.cityList.forEach(cityItem => {
                                if(code == cityItem.baiduid){
                                    cityArr.push(cityItem.cityname)
                                }
                            })
                        })
                        this.viewForm.areaCode = cityArr.join(',')

                        
                        
                        let typeArr = [];
                        this.viewForm.orderType.forEach(typtId => {
                            this.orderTypeAlls.forEach(typeItem => {
                                if(typtId == typeItem.code){
                                    typeArr.push(typeItem.name)
                                }
                            })
                        })
                        this.viewForm.orderType = typeArr

                        setTimeout(() => {
                            var idCarR = new Viewer(document.getElementById('idCarR'), {
                            url: 'data-original'
                            });
                            var idCarW = new Viewer(document.getElementById('idCarW'), {
                            url: 'data-original'
                            });
                            var drR = new Viewer(document.getElementById('drR'), {
                            url: 'data-original'
                            });
                            var drW = new Viewer(document.getElementById('drW'), {
                            url: 'data-original'
                            });
                        },1000)




                    }
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('loadingAction', false)
                })
            },
            viewOrder(phone_num){
                this.$router.push({path:'/workorder/list',query:{phone_num}})
            },
            config(row){
                // console.log(row)
                this.title = '业务类型';
                this.tableDataType = [row];
               
                this.TypeDialog = true;
                this.editTypeForm.id = row.id;
                this.editTypeForm.orderType = row.order_type.split(',');

                this.editTypeForm.orderType = row.order_type.split(',');
                
                let orderTypeSet = new Set(this.editTypeForm.orderType)
                orderTypeSet.delete('13')
                this.editTypeForm.orderType = Array.from(orderTypeSet)
               
                this.orderTypeChange('editTypeForm');
            },
            configFinish(){
                let data = _.cloneDeep(this.editTypeForm);
                data.orderType = data.orderType.join(',');

                
                this.bLoading = true;
                this.$http.get('/staff/user/updateType',{params:data}).then((response)=>{
                    this.bLoading = false;
                    var res= response.data;
                    if(res.errCode == 0){
                        this.TypeDialog = false;
                        this.pageDataReq();
                        message(this,res.message,'success')
                        
                    }else {
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    console.log(err);
                    this.bLoading = false;
                })
            },
            forbidden(row){
                let str,req={id:row.id},timeStr = new Date().valueOf().toString().slice(0,-3);
                req.timestamp = timeStr;
                req.sign = md5(timeStr+'incar');
                if(row.status == 10){
                    str = '是否禁用该用户'
                    req.status = -1;
                }else{
                    str = '是否开启该用户'
                    req.status = 1;
                }
                this.$confirm(str, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/staff/user/updateStatus', req,{type:'payload'}).then((response) => {
                        var res = response.data;
                        if (res.errCode == 0) {
                            message(this,res.message,'success')
                            this.pageDataReq();
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch(() => {
                });
            },

            exportExel(type){
                let url = '',req;
                if(type == 1){
                    url = '/ground/staff/export';
                    req = {role_id:this.role_id,where:this.where}
                }else{
                    url = '/ground/staff/exports';
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
                            let props=['id','name','phone_num','citys_name','identity_card_num','driver_license_valid','driver_license_file_no','driver_license_level','full_name','create_time','status','work_task_name'];
                            exportExcel('地服人员列表',res.data.title,props,res.data.data);
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
        props: {},
      
    }
</script>
<style lang="less">
    .gserver-list {
        .search-form .el-form--inline .el-form-item__label{
            text-align: right;
            margin-top: 0px
        }
     
        .el-form-item__content .el-button{
            width: 80%;
        }
        .add{
            .el-form--inline .el-form-item__content{
                display: block
            }
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
</style>
