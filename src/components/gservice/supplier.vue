<template>
    <div class="sup">
        <div style="margin-bottom: 20px" >
            <el-button size="mini" v-if="cp('--/staff/staff-company/add')" type="primary" @click="append">增加</el-button>
            <el-button size="mini" type="text" v-show="!isShowFilterForm" @click="filterFormSwitch(true)">展开</el-button>
        </div>
        
        <el-row class="filter-form" v-show="isShowFilterForm">
            <el-row>
                <el-button size="text" style="font-size:12px;" @click="filterFormSwitch(false)">隐藏</el-button>
            </el-row>
            <el-col :span="18">
                <el-form :model="filterForm" :inline="true">
                    <el-form-item label="供应商名称">
                        <el-input v-model="filterForm.full_name" size="small" style="width:155px"></el-input>
                    </el-form-item>
                
             
                    <el-form-item label="类型">
                            <el-select size="small" clearable style="width:155px" v-model="filterForm.type" placeholder="请选择">
                            <el-option
                            label="全部"
                            value="0">
                            </el-option>
                            <el-option
                            label="自有"
                            :value="1">
                            </el-option>
                            <el-option
                            label="外包"
                            :value="2">
                            </el-option>
                        </el-select>
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
            <el-table 
                :data="tableData"
                @sort-change="sortChange"
                border
                v-loading="loading"
                style="width: 100%;margin-top:20px;">
                <el-table-column
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                        <el-button v-if="cp('--/staff/staff-company/update')" size="mini" type="primary" @click="edit(scope.row.id)">修改</el-button>
                        <el-button v-if="cp('/staff/staff-company/status')" size="mini" type="warning" @click="forbidden(scope.row)">
                            <span v-if="scope.row.status=='0'">启用</span>
                            <span v-if="scope.row.status=='1'">禁用</span>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="ID"
                    prop="id">
                </el-table-column>
                <el-table-column
                    label="类型"
                    prop="type">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type=='1'">自有</span>
                        <span v-if="scope.row.type=='2'">外包</span>
                    </template>
                </el-table-column>
                <el-table-column
                    
                    label="地服供应商名称"
                    prop="full_name">
                </el-table-column>
                <el-table-column
                    
                    label="联系人姓名"
                    prop="charge_person_name">
                </el-table-column>
                <el-table-column
                    label="联系电话"
                    prop="phone">
                </el-table-column>
                <el-table-column
                    label="联系邮箱"
                    prop="email">
                </el-table-column>
                <el-table-column
                    sortable="custom"
                    prop="create_time"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    sortable="custom"
                    prop="modify_time"
                    label="修改时间">
                </el-table-column>
                <el-table-column 
                
                prop="status"
                label="状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status==1?'启用':'禁用' }}</span>
                    </template>
                </el-table-column>
                <el-table-column 
               
             
                label="地服人员人数" 
                prop="num"
                >
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
            <el-form :model="addEditForm" ref="addEditForm" :rules="rules" :label-width="'120px'">
                <el-form-item label="供应商名称" prop="fullName">
                    <el-input v-model="addEditForm.fullName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="addEditForm.type" size="small" placeholder="请选择">
                        <el-option
                        label="自有"
                        :value="1">
                        </el-option>
                        <el-option
                        label="外包"
                        :value="2">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人姓名" prop="chargePersonName">
                    <el-input v-model="addEditForm.chargePersonName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话" prop="phone">
                    <el-input v-model="addEditForm.phone" size="small"></el-input>
                </el-form-item>
                <el-form-item label="联系人邮箱" prop="email">
                    <el-input v-model="addEditForm.email" size="small"></el-input>
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
    export default {
        data() {
            var checkAccount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('联系人姓名不能为空'));
                }
               
                if(value.length>20){
                    return callback(new Error('联系人姓名长度不应大于20'));
                }
                callback();
            };
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('供应商姓名不能为空'));
                }
                
                if(value.length>60){
                    return callback(new Error('供应商姓名长度不应大于60'));
                }
              
                callback();
            };
            var checkType = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('供应商类型不能为空'));
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
                   
            return {
                bLoading:false,
                rules: {
                    fullName: [
                        { validator: checkName, trigger: 'blur' }
                    ],
                    chargePersonName:[
                        { validator:  checkAccount, trigger: 'blur' }
                    ],
                    type:[
                        { validator: checkType, trigger: 'change' }
                    ],
                    phone:[
                        { validator: checkMobile, trigger: 'blur' }
                    ],
                    email:[
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                },
                page: 1,//当前也
                total:0,//总数
                tableData: [],//列表数据
                reqUrl:'/ground/company/list',
                addEditDialog:false,
                title:'',
                loading:false,
                filterForm:{
                    page:1,
                    pageSize:10,
                    full_name:'',
                    type:'',
                    sort:''
                },
                isShowFilterForm:true,
                addEditForm:{
                    fullName:'',
                    chargePersonName:'',
                    type:'',
                    phone:'',
                    email:'',
                    status:''
                },
                roleList:[],
                sorts:''
            }
        },
        mounted() {
            this.pageDataReq()
        },
        methods: {
            cp,
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
                
                let data = {},
                copyData = {full_name:this.filterForm.full_name,type:this.filterForm.type};
                data.page = this.filterForm.page;
                data.pageSize = this.filterForm.pageSize;
               if(this.sorts){
                    data.sort = this.sorts;
                }else{
                    data.sort = 'id&desc'
                }
                
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
            //paixu
            sortMethod(a,b){
                return a.num-b.num;
            },
            //新增
            append(){
                this.addEditDialog=true;
                this.title = '新增';
                for(let i in this.addEditForm){
                    this.addEditForm[i] = '';
                }
            },
            beforeClose(){
                this.$refs['addEditForm'].clearValidate();
                this.addEditDialog = false;
            },
            addEditFinish(formName){
                let url,msg,data = _.cloneDeep(this.addEditForm);
                if(this.title === '新增'){
                    url = '/staff/staff-company/add';
                    msg = '新增成功';
                    delete data.id;
                    delete data.status;
                }else{
                    url = '/staff/staff-company/update';
                    msg = '修改成功';
                }
                
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.bLoading = true;
                        this.$http.post(url,data,{type:'payload'}).then((response)=>{
                            this.bLoading = false;
                            var res= response.data;
                            if(res.errCode == 0){
                                this.addEditDialog = false;
                                this.pageDataReq();
                                message(this,res.message,'success')
                            }else {
                                message(this,res.message,'error')
                            }
                        }).catch(err => {
                            console.log(err);
                            this.bLoading = false;
                        })
                    }else{
                        console.log('error submit!!');
                        return false;
                    }
                })
                
            },
            edit(id){
                this.$http.post('/staff/staff-company/selectById',{id}).then((response)=>{
                    var res = response.data;
                    if(res.errCode == 0){
                        this.title = "修改";
                        this.addEditDialog=true;

                        this.addEditForm.id = id;
                        this.addEditForm.fullName = res.attachment.fullName;
                        this.addEditForm.chargePersonName = res.attachment.chargePersonName;
                        this.addEditForm.phone = res.attachment.phone;
                        this.addEditForm.email = res.attachment.email;
                        this.addEditForm.status = res.attachment.status;
                        this.addEditForm.type = res.attachment.type;

                    }
                })
            },
            forbidden(row){
                let str,req={id:row.id};


                this.$http.post('/staff/staff-company/selectById',{id:row.id}).then((response)=>{
                    var res = response.data;
                    if(res.errCode == 0){


                        req.fullName = res.attachment.fullName;
                        req.chargePersonName = res.attachment.chargePersonName;
                        req.phone = res.attachment.phone;
                        req.email = res.attachment.email;

                        if(row.status == 0){
                            str = '是否开启该用户'
                            req.status = 1;
                        }else{
                            str = '是否禁用该用户'
                            req.status = 0;
                        }
                        this.$confirm(str, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$http.post('/staff/staff-company/update', req,{type:'payload'}).then((response) => {
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

                    }
                })
                
            },
            remove(id){
                this.$confirm('是否删除该用户', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var req=[id];
                    this.$http.post('/dc-admin/sys/user/delete', req,{type:'payload'}).then((response) => {
                        var res = response.data;
                        if (res.code == 0) {
                            message(this,'删除成功','success')
                            this.pageDataReq();
                        } else {
                            message(this,res.msg,'error')
                        }
                    })
                }).catch(() => {
                });
            },
        },
        props: {},
        watch: {}
    }
</script>
<style lang="less">
    .sup {
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
