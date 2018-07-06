<template>
    <div class="gas-list">
        <div style="margin-bottom: 20px" >
            <el-button size="mini" v-if="cp('--/staff/gasStation/add')" type="primary" @click="append">增加</el-button>
            <el-button size="mini" v-if="cp('--/staff/gasStation/massAdd')" type="primary" @click="$router.push('/gasSation/add')">批量导入</el-button>
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
                            :preloadedSwi = false
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

                    <el-form-item label="品牌">
                        <el-select
                        clearable
                        v-model="filterForm.gasBrand"
                        style="width:155px"
                        size="small"
                        placeholder="请选择">
                            <el-option label="中国石化" value="1"></el-option>
                            <el-option label="中国石油" value="3"></el-option>
                            <el-option label="中国华信" value="4"></el-option>
                            <el-option label="中国海油" value="5"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="加油站名称">
                        <el-input v-model="filterForm.stationName" size="small" style="width:155px"></el-input>
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
            <el-button size="mini" v-if="cp('--/staff/gasStation/exportByParams')" type="primary" @click="exportExel(1)">导出当前列表</el-button>
            <el-button size="mini" v-if="cp('--/staff/gasStation/exportByParamss')" type="primary" @click="exportExel(2)">导出全部列表</el-button>
            <el-table
                :data="tableData"
                border
                style="width: 100%;margin-top:20px">
                <el-table-column
                    label="操作"
                    fixed
                    width="120">
                    <template slot-scope="scope">
                        

                        <el-button size="mini" style="margin-left:10px;margin-bottom:10px" v-if="cp('--/staff/gasStation/selectById')" type="primary" @click="view(scope.row.id)">查看</el-button>

                        <el-button size="mini" style="margin-left:10px;margin-bottom:10px" v-if="cp('--/staff/gasStation/update')" type="primary" @click="edit(scope.row.id)">修改</el-button>

                        <el-button size="mini"  style="margin-bottom:10px" v-if="cp('--/staff/gasStation/updateStatus')" type="warning" @click="dispatch(scope.row)"> 
                            <span v-if="scope.row.status==1">禁用</span>
                            <span v-else>启用</span>
                        </el-button>

                        <el-button size="mini" style="margin-bottom:10px" v-if="cp('--/staff/gasStation/delete')"  type="danger" @click="forbidden(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
        
                <el-table-column
                    label="ID"
                    prop="id">
                </el-table-column>

                <el-table-column              
                    label="城市"
                    prop="areaCode">
                </el-table-column>

                <el-table-column
                    label="加油站品牌"
                    prop="gasBrand">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gasBrand==1">中国石化</span>
                        <span v-if="scope.row.gasBrand==3">中国石油</span>
                        <span v-if="scope.row.gasBrand==4">中国华信</span>
                        <span v-if="scope.row.gasBrand==5">中国海油</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="加油站名称"
                    prop="stationName">
                </el-table-column>

                <el-table-column
                    label="详细地址"
                    prop="address">
                </el-table-column>

                <el-table-column
                    label="经度"
                    prop="longitude">
                </el-table-column>

                <el-table-column
                    label="纬度"
                    prop="latitude">
                </el-table-column>

                <el-table-column
                    label="营业时间"
                    prop="businessHour">
                </el-table-column>

                <el-table-column
                    label="创建时间"
                    prop="createTime">
                </el-table-column>

            
                <el-table-column
                    prop="status"
                    label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==1">启用</span>
                        <span v-if="scope.row.status==2">禁用</span>
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
    import cp from '../../utils/checkPermissions'
    import exportExcel from '../../assets/js/exportExcel'
   
    
    export default {
        
        components:{
            sourceSelect,
        },
        data() {
            return {
                bLoading:false,
                pageNum: 1,//当前也
                total:0,//总数
                tableData: [],//列表数据
              
                cityList:[],
                cityIds:'',
                reqUrl:'/staff/gasStation/queryByParams',
                cityConfig:['baiduid','cityname','data'],
             
                filterForm:{
                    pageNum:1,
                    pageSize:20,
                    status:'',
                    areaCode:'',
                    gasBrand:'',
                    stationName:''
                },
                isShowFilterForm:true,
                title:'',
                flag:'',
        
                btnLoading:false,
                deleteBtnLoading:false,
                sorts:'',
                user_id:'',
                role_id:''
            }
        },
        created(){
        //    this.initFilterForm()
        },
        mounted() {
            this.init()
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
            initFilterForm () {
                let filterFormGasSation = this.$store.getters.filterForm.filterFormGasSation;
                if (filterFormGasSation === undefined || filterFormGasSation === null) {
                    return
                }
                if (Object.keys(filterFormGasSation).length > 0) {
                    this.filterForm = filterFormGasSation
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
                    if (tItem.createTime) {
                        tItem.createTime = DateFormat.format(new Date(tItem.createTime))
                        if (tItem.createTime.slice(0,4) === '1970') {
                            tItem.createTime = ''
                        }
                    }
                })
            },
            //获取数据
            pageDataReq() {
                this.$store.dispatch('loadingAction',true)
                let data = _.cloneDeep(this.filterForm)
                if (data.areaCode == '') {
                    data.areaCode = this.cityIds
                }
                // this.$store.dispatch('changeFfG',data)
                this.$http.post(this.reqUrl,data,null,{serveType:1, args: data, module: 'staff'}).then((response) => {
                    this.$store.dispatch('loadingAction',false)
                    let res = response.data
                    if (res.errCode === 0) {
                        this.tableData = res.attachment.gasStations
                        this.total = parseInt(res.attachment.totalCount)
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
                    path:'/gasSation/addOrEdit',
                    query:{
                        type:'add'
                    }
                })                
            },
            //查看
            view(id){
                this.$router.push({
                    path:'/gasSation/addOrEdit',
                    query:{
                        type:'view',
                        id
                    }
                })    
            },
            //修改
            edit(id){
                this.$router.push({
                    path:'/gasSation/addOrEdit',
                    query:{
                        type:'edit',
                        id
                    }
                })    
            },
            forbidden(row){
                let req = {
                    id:row.id
                }
                this.$confirm('确认删除此加油站？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('loadingAction',true)
                    this.$http.post(`/staff/gasStation/delete/${req.id}`, req, null, {serveType:1,args:{}, module: 'staff'}).then((response) => {
                        this.$store.dispatch('loadingAction',false)
                        var res = response.data
                        if (res.errCode == 0) {
                            message(this,res.message,'success')
                            this.pageDataReq()
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch(() => {
                    this.$store.dispatch('loadingAction',false)
                })
            },
            dispatch(row){
                let str,
                req={
                    id:row.id
                }
                if (row.status == '1') {
                    req.status = '2'
                    str = '确认禁用该加油站?'
                } else {
                    req.status = '1'
                    str = '确认启用该加油站?'
                }
                this.$confirm(str, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('loadingAction',true)
                    this.$http.post(`/staff/gasStation/updateStatus/${req.id}/${req.status}`, req, null, {serveType:1, args: {}, module: 'staff'}).then((response) => {
                        this.$store.dispatch('loadingAction',false)
                        var res = response.data
                        if (res.errCode == 0) {
                            message(this,res.message,'success')
                            this.pageDataReq()
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch(() => {
                    this.$store.dispatch('loadingAction',false)
                })
            },

            exportExel(type){
                let url = '',req
                if(type == 1){
                    url = '/staff/gasStation/exportByParams'
                    req = _.cloneDeep(this.filterForm)
                    if (req.areaCode == '') {
                        req.areaCode = this.cityIds
                    }
                    delete req.pageNum
                    delete req.pageSize
                }else{
                    url = '/staff/gasStation/exportByParams'
                    req = {
                        name:'',
                        status:'',
                        areaCode:this.cityIds,
                        dispatchStatus:''
                    }
                }
                this.$store.dispatch('loadingAction', true)
                this.$http.post(url, req, null, {serveType:1, args: req, module: 'staff'}).then((response) => {
                    this.$store.dispatch('loadingAction', false)
                    let res = response.data
                    if(res.errCode === 0){
                        if(res.attachment.stationList.length===0){
                            message(this,'无可导出数据','error')
                        }else{
                            let props=['_index','areaCode','gasBrand','stationName','address','longitude','latitude','businessHour','createTime','status']
                            let stationList = res.attachment.stationList
                            stationList.forEach((item,index) => {
                                item._index = index+1
                                if (item.createTime) {
                                    item.createTime =  DateFormat.format(new Date(item.createTime))
                                    if (item.createTime.slice(0,4) === '1970') {
                                        item.createTime = ''
                                    }
                                }
                            })
                            exportExcel('加油站列表',res.attachment.title,props,res.attachment.stationList)
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
    .gas-list {
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
