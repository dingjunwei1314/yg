<template>
    <div class="dot-list">
        <div style="margin-bottom: 20px" >
            <el-button size="mini" v-if="cp('--/staff/park/addPark')" type="primary" @click="append">增加</el-button>
            <el-button size="mini" v-if="cp('--/staff/park/massAdd')" type="primary" @click="$router.push('/dot/add')">批量导入</el-button>
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
                  
                    <el-form-item label="状态">
                        <el-select
                        clearable
                        v-model="filterForm.status"
                        style="width:155px"
                        size="small"
                        placeholder="请选择">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="启用" value="1"></el-option>
                            <el-option label="禁用" value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="活动网点">
                        <el-select
                        clearable
                        v-model="filterForm.dispatchStatus"
                        style="width:155px"
                        size="small"
                        placeholder="请选择">
                            <el-option label="全部" value="0"></el-option>
                            <el-option label="活动中" value="1"></el-option>
                            <el-option label="无活动" value="2"></el-option>
                        </el-select>
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
            <el-button size="mini" v-if="cp('--/staff/park/export')" type="primary" @click="exportExel(1)">导出当前列表</el-button>
            <el-button size="mini" v-if="cp('--/staff/park/export')" type="primary" @click="exportExel(2)">导出全部列表</el-button>
            <el-table
                :data="tableData"
                @sort-change="sortChange"
                border
                style="width: 100%;margin-top:20px">
                <el-table-column
                    label="操作"
                    fixed
                    width="120">
                    <template slot-scope="scope">
                        

                        <el-button size="mini" style="margin-left:10px;margin-bottom:10px" v-if="cp('--/staff/park/selectById')" type="primary" @click="view(scope.row.parkId)">查看</el-button>

                        <el-button size="mini" style="margin-left:10px;margin-bottom:10px" v-if="cp('--/staff/park/update')" type="primary" @click="edit(scope.row.parkId)">修改</el-button>

                        <el-button size="mini" style="margin-bottom:10px" v-if="cp('--/staff/parkFence/deletes')"  type="danger" @click="forbidden(scope.row)">
                            删除
                        </el-button>

                        <el-button size="mini" v-show="scope.row.status==1" style="margin-bottom:10px" v-if="cp('--/staff/park/dispatcherStatus')" :loading="btnLoading" type="warning" @click="dispatch(scope.row)"> 
                            <span v-if="scope.row.suggestCarNum===0">活动调度</span>
                            <span v-else>停止调度</span>
                        </el-button>

                    </template>
                </el-table-column>
        
                <el-table-column
                    label="ID"
                    prop="parkId">
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
                    prop="address">
                </el-table-column>

                <el-table-column
                    label="车位数量"
                    prop="parkNum">
                    
                </el-table-column>

                <el-table-column
                    label="当前服务车辆数量"
                    prop="availableCar">
                    <template slot-scope="scope">
                        <el-button size="mini"  v-if="cp('--/staff/park/findCar')" type="text" @click="viewDotCar(scope.row.parkId)">
                            {{scope.row.availableCar}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column
                    label="位置"
                    prop="isFenceRange">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isFenceRange==1">围栏内</span>
                        <span v-if="scope.row.isFenceRange==2">围栏外</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="有效半径（m）"
                    prop="operateRange">
                </el-table-column>

                <el-table-column
                    prop="status"
                    label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status===1">启用</span>
                        <span v-if="scope.row.status===2">禁用</span>
                        <span v-if="scope.row.status===0">待运营</span>
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

        <!--活动调度-->
        <el-dialog :title="title" :visible.sync="dispatchDialog">
            <el-form :model="dispatchForm" ref="dispatchForm" :rules="dispatchFormRules" :label-width="'180px'">

                        <el-form-item v-if="flag" label="此网点需要调度的车辆数量" prop="carCount">
                            <el-input  
                            max="999"
                            min="1"
                            v-model="dispatchForm.carCount" 
                            placeholder="请输入数值，最大999"
                            type="number" size="small"></el-input> 辆
                        </el-form-item>
                       
        
                        <el-form-item label="备注" prop="remark">
                            <el-input placeholder="备注最多输入600字符" v-model="dispatchForm.remark" type="textarea" size="small"></el-input>
                        </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dispatchDialog = false">取消</el-button>
                <el-button type="primary" :loading="bLoading" @click="dispatchSure('dispatchForm')">确定</el-button>
            </div>
        </el-dialog>


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
            var carCountValidator = (rule, value, callback) => {
                // console.log(value)
                if (value === '') {
                    return callback(new Error('请输入车辆数'))
                }else{
                    if(value<=0 || value>999){
                        return callback(new Error('数量必须在1-999之间'))
                        
                    }

                    if (!Number.isInteger(Number(value))) {
                       
                        return callback(new Error('只能输入整数'))
                        
                    }
                    callback()
                }
            }  
            
            return {
                picUrl,
                bLoading:false,
              
                pageNum: 1,//当前也
                total:0,//总数
                tableData: [],//列表数据
              
                cityList:[],
                cityIds:'',
                reqUrl:'/staff/park/queryPark',
                where:'',
               
                cityConfig:['baiduid','cityname','data'],
             
                filterForm:{
                    pageNum:1,
                    pageSize:20,
                    name:'',
                    status:'',
                    areaCode:'',
                    dispatchStatus:''
                },
                isShowFilterForm:true,
                title:'',
                flag:'',
                dispatchDialog:false,
                dispatchForm:{
                    parkId:'',
                    status:1,
                    remark:'',
                    carCount:'',
                    userId:''
                },
                dispatchFormRules:{
                    carCount: [
                        { required: true, trigger: 'blur',validator: carCountValidator }
                    ],
                    remark: [
                        { required: true, trigger: 'blur',max:600,message:'请输入备注，600字以内' }
                    ],
                },
                btnLoading:false,
                deleteBtnLoading:false,
                sorts:'',
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
            // typeFilter(val,data){
            //     if(val){
            //         let arr = []
            //         val.split(',').forEach(item1 => {
            //             data.forEach(item2 => {
            //                 if(item1 == item2.code){
            //                     arr.push(item2.name)
            //                 }
            //             })
            //         })
            //         return arr.join(',')
            //     }else{
            //         return ''
            //     }
            // }
        },
        methods: {
            cp,
            init(){
                let u = localStorage._MyDaDao_user_data,user_id
                if(u){
                    this.user_id = JSON.parse(u).user_id
                    this.role_id = JSON.parse(u).role_id
                }
            },
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
                        this.tableData = res.attachment.parksList
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
            //新增
            append(){
                this.$router.push({
                    path:'/dot/addOrEdit',
                    query:{
                        type:'add'
                    }
                })                
            },
            //查看
            view(parkId){
                // console.log(parkId)
                this.$router.push({
                    path:'/dot/addOrEdit',
                    query:{
                        type:'view',
                        parkId
                    }
                })    
            },
            //修改
            edit(parkId){
                // console.log(parkId)
                this.$router.push({
                    path:'/dot/addOrEdit',
                    query:{
                        type:'edit',
                        parkId
                    }
                })    
            },
            //查看车辆
            viewDotCar(parkId){
                this.$router.push({
                    path:'/dot/carList',
                    query:{
                        parkId
                    }
                })   
            },
            forbidden(row){
                let str,
                req={
                    parkId:row.parkId,
                    fenceId:'',
                    type:1
                }
               
                this.$confirm('确认删除此网点？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteBtnLoading = true
                    this.$http.post('/staff/parkFence/delete', req,{type:'payload'}).then((response) => {
                        this.deleteBtnLoading = false
                        var res = response.data
                        if (res.errCode == 0) {
                            message(this,res.message,'success')
                            this.pageDataReq()
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch(() => {
                    this.deleteBtnLoading = false
                })
            },

            dispatch (row) {
                if(row.suggestCarNum===0){
                    this.title = '活动调度'
                    this.flag = true
                }else{
                    this.title = '确认停止调度？'
                    this.flag = false
                }
                this.dispatchForm.parkId = row.parkId
                this.dispatchForm.remark = ''
                this.dispatchForm.carCount = ''
                this.dispatchDialog = true
            },

            dispatchSure(formName){
                let url = '/staff/park/dispatcherStatus',
                data = _.cloneDeep(this.dispatchForm)
                data.userId = this.user_id
                
                if(this.flag){
                    data.status = 1
                }else{
                    data.status = 2
                    delete data.carCount
                }
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        this.bLoading = true
                        this.$http.post(url,data).then((response)=>{
                            this.bLoading = false
                            var res= response.data
                            if(res.errCode == 0){
                                this.pageDataReq()
                                message(this,res.message,'success')
                                this.dispatchDialog = false
                            }else {
                                message(this,res.message,'error')
                            }
                        }).catch(err => {
                            console.log(err)
                            this.bLoading = false
                        })
                    }else{
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            exportExel(type){
                let url = '',req
                if(type == 1){
                    url = '/staff/park/export'
                    req = _.cloneDeep(this.filterForm)
                    if (req.areaCode == '') {
                        req.areaCode = this.cityIds
                    }
                    delete req.pageNum
                    delete req.pageSize
                }else{
                    url = '/staff/park/export'
                    req = {
                        name:'',
                        status:'',
                        areaCode:this.cityIds,
                        dispatchStatus:''
                    }
                }
                this.$store.dispatch('loadingAction', true)
                this.$http.post(url,req,{type:'payload'}).then((response) => {
                    this.$store.dispatch('loadingAction', false)
                    let res = response.data
                    if(res.errCode === 0){
                        if(res.attachment.parksList.length===0){
                            message(this,'无可导出数据','error')
                        }else{
                            let props=['_index','areaCode','parkName','address','longitude','latitude','parkNum','status','phoneNum','price','parkType','validFence']
                            let parksList = res.attachment.parksList
                            parksList.forEach((item,index) => {
                                item._index = index+1
                            })
                            exportExcel('网点列表',res.attachment.title,props,res.attachment.parksList)
                        }
                    }else{
                        message(this,res.message,'error')
                        this.$store.dispatch('loadingAction', false)
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
    .dot-list {
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
