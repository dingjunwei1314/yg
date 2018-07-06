<template>
    <div class="dis-list">
        <div style="margin-bottom: 20px" >
            
            <el-button size="mini" type="text" v-show="!isShowFilterForm" @click="filterFormSwitch(true)">展开</el-button>
        </div>

        <el-row class="filter-form" v-show="isShowFilterForm">
            <el-row>
                <el-button size="text" style="font-size:12px" @click="filterFormSwitch(false)">隐藏</el-button>
            </el-row>
            <el-col :span="18" class="search-form">
                <el-form :model="filterForm" :inline="true" label-width="80px">
                    <el-form-item label="服务城市">
                        <sourceSelect
                            :valProp.sync="filterForm.areaCode"
                            url="/city/city/all"
                            :config="cityConfig" />
                    </el-form-item>
                  
                


                    <el-form-item label="网点名称">
                        <el-input v-model="filterForm.name" size="small" style="width:155px"></el-input>
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
          
            <el-table
                :data="tableData"
                @sort-change="sortChange"
                border
                style="width: 100%margin-top:20px">
                
        
                <el-table-column
                    label="ID"
                    prop="id">
                </el-table-column>

                <el-table-column              
                    label="服务城市"
                    prop="areaCode">
                </el-table-column>

                <el-table-column
                    label="网点名称"
                    prop="parkName">
                </el-table-column>

                <el-table-column
                    label="详细地址"
                    prop="parkAddress">
                </el-table-column>

                <el-table-column
                    label="操作"
                    prop="status">

                    <template slot-scope="scope">
                        <span v-if="scope.row.status===1">活动调度</span>
                        <span v-if="scope.row.status===2">停止调度</span>
                    </template>
                  
                </el-table-column>

                <el-table-column
                    label="设置的调度车辆数"
                    prop="dispatcherCount">
                  
                </el-table-column>

                <el-table-column
                    label="操作人"
                    prop="userId"
                    >
                    
                  
                </el-table-column>

                <el-table-column
                    label="操作时间"
                    prop="operationTime">
                  
                </el-table-column>

                <el-table-column
                    label="操作"
                    fixed
                    width="120">
                    <template slot-scope="scope">
                      

                        <el-button size="mini"  v-if="cp('--/ground/staff/view')" type="primary" @click="view(scope.row)">查看备注</el-button>

                    </template>
                </el-table-column>
                
            </el-table>
        </div>
        <div style="text-align:center;margin-top:30px">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page.sync="pageNum"
                :page-sizes="[20, 30, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import qs from 'qs'
    import message from '../../assets/js/message'

    import sourceSelect from '../common/sourceSelect'
    import {DOWN_URL,picUrl} from '../../config/app'
    import cp from '../../utils/checkPermissions'
    import exportExcel from '../../assets/js/exportExcel'
   
    
    export default {
        
        components:{
            sourceSelect,
        },
        data() {
           
            return {
                picUrl,
                bLoading:false,
              
                pageNum: 1,//当前也
                total:0,//总数
                tableData: [],//列表数据
              
                cityList:[],
                userList:[],
                cityIds:'',
                reqUrl:'/staff/park/dispatch',
                where:'',
               
                cityConfig:['baiduid','cityname','data'],
             
                filterForm:{
                    pageNum:1,
                    pageSize:20,
                    name:'',
                    areaCode:'',
                  
                },
               
                isShowFilterForm:true,
                btnLoading:false,
                user_id:'',
                role_id:''
               
            }
        },
        created(){
           
        },
        mounted() {
            this.init()

            // this.pageDataReq()
        
            this.initCity()

            this.initUser()
        },
        computed: {
            test:function () {
                this.cityList
                this.userList
                this.tableData
                return this
            }
        },
        watch: {
            test(){
                // console.log(this.tableData.length, this.cityList.length, this.userList.length)
                if(this.tableData.length>0 && this.cityList.length>0 && this.userList.length>0){
                    this.handleDate()
                }
            }
        },
        filters:{
          
        },
        methods: {
            cp,
            
            handleDate(){
                this.tableData.forEach(tItem => {
                    let cityArr = [],cityIdArr = tItem.areaCode.split(',')
                    this.cityList.forEach(item => {
                        cityIdArr.forEach(idItem => {
                            if(item.baiduid == idItem){
                                cityArr.push(item.cityname) 
                            }
                        })
                        
                    })
                    this.userList.forEach(user => {
                        if(user.user_id == tItem.userId){
                            tItem.userId = user.user_name
                        }
                    })

                    tItem.operationTime = DateFormat.format(new Date(tItem.operationTime))

                    tItem.areaCode = cityArr.join(',')
                })
            },
            //sort-change
            sortChange(res){
                if(res.prop){
                this.sorts= res.prop+'&'+res.order.split('ending')[0]
                }else {
                this.sorts=''
                }
                this.filterForm.page = 1
                this.page = 1
                this.pageDataReq()
            },
            //获取数据
            pageDataReq() {
                
                this.$store.dispatch('loadingAction',true)
                let data = _.cloneDeep(this.filterForm)
                if (data.areaCode == '') {
                    data.areaCode = this.cityIds
                }
                this.$http.post(this.reqUrl,data).then((response) => {
                    this.$store.dispatch('loadingAction',false)
                    var res = response.data
                   
                    if (res.errCode === 0) {
                        this.tableData = res.attachment.recordsList
                        this.total = parseInt(res.attachment.totalCount)
                        //  console.log(this.tableData)
                    }else {
                        this.tableData = []
                        this.page = 1
                    }
                }).catch(err => {
                    console.log(err)
                    this.$store.dispatch('loadingAction',false)
                })
            },
            init(){
                let u = localStorage._MyDaDao_user_data,user_id
                if(u){
                    this.user_id = JSON.parse(u).user_id
                    this.role_id = JSON.parse(u).role_id
                }
            },
            initCity(){
                this.$http.post('/city/city/all',{role_id:this.role_id}).then((response) => {
                    var res = response.data
                    if (res.code === 200) {
                        this.cityList = res.data
                        this.cityIds = ''
                        this.cityIds = this.cityList.map(item => {
                            return item.baiduid
                        })
                        this.cityIds = this.cityIds.join(',')
                        this.pageDataReq()
                    }
                })
            },

            initUser(){
                this.$store.dispatch('GetAllUser').then(res => {
                    // console.log(res)
                    if (res) {
                        this.userList = res
                    }
                    
                })
            },
         
            //切换分页
            handleCurrentChange(val) {
                this.pageNum=val
                this.filterForm.pageNum = val
                this.pageDataReq()
            },
            handleSizeChange(val){
                
                this.filterForm.pageSize = val
                this.pageDataReq()
            },
            //展开隐藏搜索
            filterFormSwitch(swi){
                this.isShowFilterForm = swi
            },
            //搜索与重置
            search(swi){
                if(swi){
                    this.filterForm.pageNum = 1
                    this.pageNum = 1
                    this.pageDataReq()
                }else{
                    for(let i in this.filterForm){
                        if(i != 'pageSize' && i != 'pageNum'){
                            this.filterForm[i] = ''
                        }
                    }
                }
            },
            //刷新
            refresh(){
                for(let i in this.filterForm){
                    if(i != 'pageSize' && i != 'pageNum'){
                        this.filterForm[i] = ''
                    }
                }
                this.filterForm.pageNum = 1
                this.pageNum = 1
                this.pageDataReq()
            },
            view(row){
                this.$alert(row.remark, '备注', {
                    dangerouslyUseHTMLString: true
                }).catch(err => {})
            }

      
        },
        props: {},
      
    }
</script>
<style lang="less">
    .dis-list {
        .search-form .el-form--inline .el-form-item__label{
            text-align: right;
            margin-top: 0px
        }
        .el-form-item__content>div{
            width: 80%
        }
        .el-form-item__content .el-button{
            width: 80%
        }

    }

    .filter-form{
        background: white;
        padding: 10px;
        margin-bottom: 20px
    }

    .fade-enter-active, .fade-leave-active {
    transition: height 1.5s
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    height: 0
    }
    .fade-enter-to, .fade-leave /* .fade-leave-active below version 2.1.8 */ {
    height: '300px'
    }
    .el-form--inline .el-form-item__label{
        text-align: left
    }
    .el-dialog{
        width: 70%
    }
    .el-checkbox+.el-checkbox{
        margin-left: 0px;
        margin-right: 10px
    }
    .el-checkbox{
        margin-right: 10px
    }
</style>
