<template>
    <div class="log">
        <el-form>
            <el-form-item label="后台类型">
                <el-select style="width:150px" v-model="platformType" @change="refresh" placeholder="请选择">
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
        </el-form>
        <div style="margin-bottom: 20px" >
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

                    <el-form-item label="用户名">
                        <el-input v-model="filterForm.user_name" size="small" style="width:155px"></el-input>
                    </el-form-item>

                    <el-form-item label="UID">
                        <el-input v-model="filterForm.user_id" size="small" style="width:155px"></el-input>
                    </el-form-item>

                    <el-form-item label="信息">
                        <el-input v-model="filterForm.message" size="small" style="width:155px"></el-input>
                    </el-form-item>

                    <el-form-item label="类型">
                        <el-input v-model="filterForm.category" size="small" style="width:155px"></el-input>
                    </el-form-item>

                    <el-form-item label="IP">
                        <el-input v-model="filterForm.ip" size="small" style="width:155px"></el-input>
                    </el-form-item>
                    <el-form-item label="操作时间" label-width="100px">
                        <el-date-picker
                        size="small"
                        value-format="timestamp"
                        style="width:350px"
                        v-model="filterForm.log_time"
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
            <el-table 
                :data="tableData"
                :default-sort = "{prop: 'createTime', order: 'descending'}"
                border
                style="width: 100%;margin-top:20px;">
                <el-table-column
                    label="操作"
                    width="">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="mini" v-if="cp('--/log')" type="primary" @click="edit(scope.row.id)">查看</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="ID"
                    prop="id">
                </el-table-column>

                <el-table-column
                    label="UID"
                    prop="user_id">
                </el-table-column>

                <el-table-column
                    min-width="300"
                    label="信息"
                    prop="message">
                </el-table-column>
                
                <el-table-column
                    label="url"
                    prop="prefix">
                </el-table-column>
                
                <el-table-column
                    label="账号"
                    prop="user_account">
                </el-table-column>
                <el-table-column
                    label="类型"
                    prop="category">
                </el-table-column>

                <el-table-column
                    label="时间"
                    prop="log_time">
                    <template slot-scope="scope">
                        <span>{{scope.row.log_time}}</span>
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
        <el-dialog :title="title" :visible.sync="addEditDialog">
            <el-form :model="addEditForm" :label-width="'120px'">

                <el-form-item label="ID">
                    {{addEditForm.id}}
                   
                </el-form-item>
        
                <el-form-item label="姓名">
                    {{addEditForm.user_account}}
                   
                </el-form-item>
                <el-form-item label="时间">
                    {{addEditForm.log_time}}
                </el-form-item>
                <el-form-item label="url">
                    {{addEditForm.prefix}}
                </el-form-item>
                <el-form-item label="信息">
                    <div style="white-space:normal;word-break:break-all"><pre>{{addEditForm.message}}</pre></div>
                </el-form-item>
                
            </el-form>
        </el-dialog>
    </div>
</template>


<script>
    import qs from 'qs'
    import message from '../../assets/js/message'
    import cp from '../../utils/checkPermissions'
    
    export default {
        data() {
            return {
                page: 1,//当前也
                total:0,//总数
                tableData: [],//列表数据
                reqUrl:'/system/log/list',
                addEditDialog:false,
                platformType:'1',
                title:'日志详情',
              
                filterForm:{
                    page:1,
                    pageSize:10,
                    user_account:'',
                    category:'',
                    user_name:'',
                    message:'',
                    user_id:'',
                    ip:'',
                    log_time:[]
                },
                isShowFilterForm:true,
                addEditForm:{
                    prefix:'',
                    user_account:'',
                    log_time:'',
                    message:''
                },
               
            }
        },
        created(){
            this.pageDataReq();
        },
        mounted() {

        },
        filters:{
            
           
        },
        methods: {
            cp,
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
            //获取数据
            pageDataReq() {
                this.$store.dispatch('loadingAction',true);
                let data = {},copyData = _.cloneDeep(this.filterForm);
                data.page = this.filterForm.page;
                data.pageSize = this.filterForm.pageSize;
                data.sort = '';

                delete copyData.page;
                delete copyData.pageSize;
               
               
                if(copyData.log_time!=null && copyData.log_time[0]){
                    copyData.log_time = copyData.log_time[0]/1000+'--'+copyData.log_time[1]/1000;
                }else{
                    copyData.log_time = '';
                }

                
                data.where = qs.stringify(copyData);
               
                this.$http.post(this.reqUrl,data,{},{platformType:this.platformType}).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                    if (res.code === 200) {
                        this.tableData = res.data.data;
                        this.total=parseInt(res.data.total);
                        this.tableData.forEach(item => {
                            item.log_time = DateFormat.format(new Date(parseInt(item.log_time)*1000));
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
                this.pageDataReq();
            },
            edit(id){
                let data = {id};
                this.$http.post('/system/log/view',data,{},{platformType:this.platformType}).then((response)=>{
                    var res= response.data;
                    if(res.code === 200){
                        this.addEditDialog = true;
                        this.addEditForm = res.data;

                        this.addEditForm.log_time = DateFormat.format(new Date(parseInt(this.addEditForm.log_time)*1000));
                    }else {
                        message(this,res.message,'error')
                    }
                })
            },
          
        },
        props: {},
        watch: {}
    }
</script>
<style lang="less">
    .log {
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

    .log .el-dialog{
        width: 80%;
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
