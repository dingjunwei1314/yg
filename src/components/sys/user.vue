<template>
    <div class="user-sys">
        <div style="margin-bottom: 20px" >
            <el-button size="mini" type="primary" v-if="cp('--/access/account/add')" @click="append">增加</el-button>
            <el-button size="mini" type="text" v-show="!isShowFilterForm" @click="filterFormSwitch(true)">展开</el-button>
        </div>
        
        <el-row class="filter-form" v-show="isShowFilterForm">
            <el-row>
                <el-button size="text" style="font-size:12px;" @click="filterFormSwitch(false)">隐藏</el-button>
            </el-row>
            <el-col :span="18" class="search-form">
                <el-form :model="filterForm" :inline="true" label-width="100px">
                    <el-form-item label="账号">
                        <el-input v-model="filterForm.user_account" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="filterForm.user_mobile" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="姓名">
                        <el-input v-model="filterForm.user_name" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="filterForm.user_email" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="城市">
                        <el-select  v-model="filterForm.city_ids" clearable style="width:155px" size="small" placeholder="请选择城市">
                            <el-option
                            v-for="item in citys"
                            :key="item.baiduid"
                            :label="item.cityname"
                            :value="item.baiduid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="后台类型">
                        <el-select v-model="filterForm.platformType" @change="initfilterFormRoles($event)" placeholder="请选择">
                            <el-option
                            label="运管后台"
                            value="1">
                            </el-option>
                            <el-option
                            label="业务后台"
                            value="2">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-select filterable  clearable v-model="filterForm.role_id" style="width:155px" size="small" placeholder="请选择角色">
                            <el-option
                            v-for="item in filterFormRoles"
                            :key="item.role_id"
                            :label="item.role_name"
                            :value="item.role_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册时间" >
                        <el-date-picker
                            size="small"
                            value-format="timestamp"
                            style="width:350px"
                            v-model="filterForm.user_creation_time"
                            type="datetimerange"
                            align="right"
                            :default-time="['00:00:00', '23:59:59']"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="最后登录时间" >
                        <el-date-picker
                        size="small"
                        :default-time="['00:00:00', '23:59:59']"
                        value-format="timestamp"
                        style="width:350px"
                        v-model="filterForm.user_last_login_time"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
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
            <el-button size="mini" type="primary" v-if="cp('--access/account/export')" @click="exportExel(1)">导出当前列表</el-button>
            <el-button size="mini" type="primary" v-if="cp('--access/account/exports')" @click="exportExel(2)">导出全部列表</el-button>
            <el-table 
                :data="tableData"
                :default-sort = "{prop: 'createTime', order: 'descending'}"
                border
                style="width: 100%;margin-top:20px;">
                <el-table-column
                    label="操作"
                    fixed
                    width="120">
                    <template slot-scope="scope">
                        <div v-if="scope.row.user_id!=1">
                            <el-button style="margin-left:10px;margin-bottom:10px" v-if="cp('--/access/account/edit')" size="mini" type="primary" @click="edit(scope.row)">修改</el-button>
                            <el-button style="margin-bottom:10px" v-if="cp('--/access/account/status')" size="mini" type="warning" @click="forbidden(scope.row)">
                                <span v-if="scope.row.status==1">禁用</span>
                                <span v-else>启用</span>
                            </el-button>
                            <el-button style="margin-bottom:10px" v-if="cp('--/access/account/del')" size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
    
                    label="ID"
                    prop="user_id">
                </el-table-column>
                <el-table-column
    
                    label="账户"
                    prop="user_account">
                </el-table-column>
                <el-table-column
    
                    label="姓名"
                    prop="user_name">
                </el-table-column>
                <el-table-column
                    label="手机号"
                    prop="user_mobile">
                </el-table-column>
                <el-table-column
                    label="邮箱"
                    prop="user_email">
                </el-table-column>
                <el-table-column  
                    label="城市">
                    <template slot-scope="scope">
                        <span>{{ scope.row.city_ids|cityFilter(citys) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
    
                    prop="role_name"
                    label="角色">
                </el-table-column>
                <el-table-column 

                prop="status"
                label="状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status==1?'启用':'禁用' }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
                label="创建时间" 
>
                    <template slot-scope="scope">
                        <span>{{ scope.row.user_creation_time|timeFilter }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
  
                label="最后登录时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.user_last_login_time|timeFilter }}</span>
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

        <!--增加-->
        <el-dialog :title="title" :visible.sync="addEditDialog" :before-close="beforeClose">
            <el-form :model="addEditForm" ref="addEditForm" :label-width="'120px'" :rules="rules">
                <el-form-item label="账号" prop="user_account">
                    <el-input v-model="addEditForm.user_account" placeholder="必须是5-20位字母或者数字" size="small"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="user_pwd">
                    <el-input v-model="addEditForm.user_pwd" @focus="focus" type="password" size="small" placeholder="必须是6-20位字母或者数字"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="user_name">
                    <el-input v-model="addEditForm.user_name"  size="small" placeholder="必须是中文"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="user_mobile">
                    <el-input v-model="addEditForm.user_mobile" placeholder="真实手机号" size="small"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="user_email">
                    <el-input v-model="addEditForm.user_email" placeholder="真实邮箱"  size="small"></el-input>
                </el-form-item>
                <el-form-item label="后台类型" prop="platformType">
                    <el-select v-model="addEditForm.platformType" @change="initRoles($event)" placeholder="请选择">
                        <el-option
                        label="运管后台"
                        value="1">
                        </el-option>
                        <el-option
                        label="业务后台"
                        value="2">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="role_id">
                    <el-select filterable v-model="addEditForm.role_id" size="small" placeholder="请选择角色">
                        <el-option
                        v-for="item in roles"
                        :key="item.role_id"
                        :label="item.role_name"
                        :value="item.role_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="beforeClose">取消</el-button>
                <el-button type="primary" :loading="bLoading" @click="addEditFinish('addEditForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import qs from 'qs'
    import message from '../../assets/js/message'
    import cp from '../../utils/checkPermissions'

    import {DOWN_URL} from '../../config/app';
    import exportExcel from '../../assets/js/exportExcel';
    export default {
        name:'user',
        data() {
            var checkAccount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('账号不能为空'));
                }
                var reg=/[\u2E80-\u9FFF]+/g;
                if(value.length<5 || value.length>20 || reg.test(value)){
                    return callback(new Error('账号应为5-20位字母或者数字'));
                }
                callback();
            };
            var checkPsd = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('密码不能为空'));
                }
                if(value == this.user_pwd){
                    callback();
                }else{
                    var reg=/[\u2E80-\u9FFF]+/g;
                    if(value.length<6 || value.length>20 || reg.test(value)){
                        return callback(new Error('密码应为6-20位字母或者数字'));
                    };
                    callback();
                }
                
                
            };
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('姓名不能为空'));
                }
                
                var reg=/^[\u2E80-\u9FFF]+$/;//Unicode编码中的汉字范围
                if(!reg.test(value)){
                    return callback(new Error('姓名必须是中文'));
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
            var checkEmail = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('邮箱不能为空'));
                }
                
                var reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
                if(!reg.test(value)){
                    return callback(new Error('邮箱格式错误'));
                }
                callback();
            };
            var checkId = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('角色不能为空'));
                }
                callback();
            };
            return {
                rules: {
                    user_account: [
                        {required:true, validator: checkAccount, trigger: 'blur' }
                    ],
                    user_pwd: [
                        {required:true, validator: checkPsd, trigger: 'blur' }
                    ],
                    user_name:[
                        {required:true, validator: checkName, trigger: 'blur' }
                    ],
                    user_mobile:[
                        {required:true, validator: checkMobile, trigger: 'blur' }
                    ],
                    user_email:[
                        {required:true, validator: checkEmail, trigger: 'blur' }
                    ],
                    role_id:[
                        {required:true, validator: checkId, trigger: 'change' }
                    ],
                    platformType:[
                        {required:true, message:'后台类型不能为空', trigger: 'change' }
                    ]
                },
                page: 1,//当前也
                total:0,//总数
                tableData: [],//列表数据
                reqUrl:'/access/account/list',
                addEditDialog:false,
                pswPlaceholder:'',
                bLoading:false,
                title:'',
                roles:[],
                filterFormRoles:[],
                citys:[],
                filterForm:{
                    page:1,
                    pageSize:10,
                    user_account:'',
                    user_name:'',
                    city_ids:'',
                    user_mobile:'',
                    user_email:'',
                    role_id:'',
                    platformType:'',
                    user_creation_time:[],
                    user_last_login_time:[]
                },
                isShowFilterForm:true,
                addEditForm:{
                    user_id:'',
                    user_account:'',
                    user_pwd:'',
                    user_name:'',
                    user_mobile:'',
                    user_email:'',
                    role_id:'',
                    status:'',
                    platformType:'1'
                },
                where:'',
                roleList:[],
                role_id:'',
                user_pwd:''
            }
        },
        created(){
            this.getRoleId()
            this.initRoles(1);
            this.initCitys();
            this.pageDataReq();
        },
        mounted() {

        },
        filters:{
            timeFilter(val){
                if(val){
                    let str = DateFormat.format(new Date(parseInt(val*1000)));
                    return str;
                }else{
                    return ''
                }
            },
            cityFilter(val,data){
                if(val == '' || val === null){
                    return ''
                }else{
                    let arr = [],str,idArr=[];
                    idArr = val.split(',');
                    idArr.forEach(item1 => {
                        data.forEach(item2 => {
                            if(item1 == item2.baiduid){
                                arr.push(item2.cityname)
                            }
                        })
                    })
                    str = arr.join(',');
                    return str;
                }
            }
        },
        methods: {
            cp,
            //展开隐藏搜索
            filterFormSwitch(swi){
                this.isShowFilterForm = swi;
            },
            //获取当前用户id
            getRoleId(){
                let user = localStorage._MyDaDao_user_data;
                if(user){
                        this.role_id = JSON.parse(user).role_id;
                }
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
                            this.filterForm[i] = typeof this.filterForm[i] ==='object'? []:''
                        }
                    }
                }
            },
            //刷新
            refresh(){
                for(let i in this.filterForm){
                    if(i != 'pageSize' && i != 'page'){
                        this.filterForm[i] = typeof this.filterForm[i] ==='object'? []:''
                    }
                }
                this.filterForm.page = 1;
                this.page = 1;
                this.pageDataReq();
            },
            //获取全部角色
            initRoles(platformType){
                this.addEditForm.role_id = ''
                this.$http.post('/access/role/all',{},{},{platformType}).then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.roles = res.data;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            //获取全部角色
            initfilterFormRoles(platformType){
                this.$http.post('/access/role/all',{},{},{platformType}).then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.filterFormRoles = res.data;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            //获取城市列表
            initCitys(){
                this.$http.post('/city/city/all',{role_id:this.role_id}).then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.citys.push(...res.data);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            //获取数据
            pageDataReq() {
                this.$store.dispatch('loadingAction',true);
                let data = {},copyData = _.cloneDeep(this.filterForm);
                data.page = this.filterForm.page;
                data.pageSize = this.filterForm.pageSize;
                data.sort = '';

                delete copyData.page;
                delete copyData.pageSize;
                delete copyData.platformType

                if(copyData.city_ids === '000'){
                    let cityArr = [];
                    this.citys.forEach(item => {
                        if(item.baiduid !== '000'){
                            cityArr.push(item.baiduid)
                        }
                    });
                    copyData.city_ids = cityArr.join(',')
                }
               
                if(copyData.user_creation_time!=null && copyData.user_creation_time[0]){
                    copyData.user_creation_time = copyData.user_creation_time[0]/1000+'--'+copyData.user_creation_time[1]/1000;
                }else{
                    copyData.user_creation_time = '';
                }

                if(copyData.user_last_login_time!=null && copyData.user_last_login_time[0]){
                    copyData.user_last_login_time = copyData.user_last_login_time[0]/1000+'--'+copyData.user_last_login_time[1]/1000;
                }else{
                    copyData.user_last_login_time = ''
                }
                
                data.where = qs.stringify(copyData);
                this.where = qs.stringify(copyData);
                
                this.$http.post(this.reqUrl,data,{},{platformType: 1}).then((response) => {
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
            //切换分页
            handleCurrentChange(val) {
                this.page=val;
                this.filterForm.page = val;
                this.pageDataReq();
            },
            //新增
            append(){
                this.pswPlaceholder = '请输入密码';
                this.addEditDialog = true;
                this.title = '新增';
                for(let i in this.addEditForm){
                    this.addEditForm[i] = ''
                }
                this.addEditForm.platformType = ''
                this.roles = []
            },
            beforeClose(){
                this.$refs['addEditForm'].clearValidate();
                this.addEditDialog = false;
            },
            focus(){
                if(this.title == '修改'){
                    this.addEditForm.user_pwd = ''
                }
            },
            addEditFinish(formName){
                let url,msg,data = _.cloneDeep(this.addEditForm);
                delete data.platformType;
                if(this.title === '新增'){
                    url = '/access/account/add';
                    msg = '新增成功';
                    delete data.user_id;
                    data.status = 1;
                }else{
                    url = '/access/account/edit';
                    msg = '修改成功';
                }
                
                if(data.user_pwd != this.user_pwd){
                    data.user_pwd = data.user_pwd? md5(data.user_pwd):'';
                }
                
                
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.bLoading = true;
                        this.$http.post(url,data,{},{platformType: this.addEditForm.platformType}).then((response)=>{
                            var res= response.data;
                            this.bLoading = false;
                            if(res.code === 200){
                                this.pageDataReq();
                                message(this,msg,'success');
                                this.addEditDialog = false;
                            }else {
                                message(this,res.message,'error')
                            }
                        }).catch(err =>{
                            this.bLoading = false;
                        })
                    }else{
                        this.bLoading = false;
                        console.log('error submit!!');
                        return false;
                    }
                })

                
            },
            edit(row){
                this.pswPlaceholder = '默认空表示不修改密码';
                this.title = '修改';
                let data = {user_id:row.user_id};
                this.$http.post('/access/account/view',data,{type:'payload'}).then((response)=>{
                    var res= response.data;
                    if(res.code === 200){
                        this.addEditDialog = true;
                        for(let i in this.addEditForm){
                            this.addEditForm[i] = res.data[i]
                        }
                        this.addEditForm.platformType = ''
                        this.roles = []
                        this.user_pwd = res.data.user_pwd;
                    
                    }else {
                        message(this,res.message,'error')
                    }
                })
            },
            forbidden(row) {
                let msg1,msg2,url='/access/account/status',data={user_id:row.user_id};
                if(row.status == 1){
                    msg1 = '确认禁用吗?';
                    msg2 = '禁用成功';
                    data.status = '2'
                }else{
                    msg1 = '确认启用吗?';
                    msg2 = '启用成功';
                    data.status = '1'
                }
                this.$confirm(msg1, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('loadingAction',true);
                    this.$http.post(url,data,{type:'payload'}).then((response)=>{
                        this.$store.dispatch('loadingAction',false);
                        var res = response.data;
                        if (res.code === 200) {
                            message(this,msg2,'success')
                            this.pageDataReq();
                        } else {
                            message(this,res.message,'error')
                        }

                    }).catch(err => {
                        this.$store.dispatch('loadingAction',false);
                    })

                }).catch(() => {
                });
            },
            remove(row){
                this.$confirm('是否删除该用户', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var req={user_id:row.user_id};
                    this.$store.dispatch('loadingAction',true);
                    this.$http.post('/access/account/del', req,{type:'payload'}).then((response) => {
                        this.$store.dispatch('loadingAction',false);
                        var res = response.data;
                        if (res.code === 200) {
                            message(this,'删除成功','success')
                            this.pageDataReq();
                        } else {
                            message(this,res.message,'error')
                        }
                    }).catch(err => {
                        this.$store.dispatch('loadingAction',false);
                    })
                }).catch(() => {
                });
            },
            //导出           
            exportExel(type){
                let url = '',req;
                if(type == 1){
                    url = '/access/account/export';
                    req = {role_id:this.role_id,where:this.where}
                }else{
                    url = '/access/account/exports';
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
                            let props=['user_account','user_name','user_mobile','user_email','city_name','role_name','user_creation_time','user_last_login_time','status'];
                            exportExcel('账户列表',res.data.title,props,res.data.data);
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
    .user-sys {
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
