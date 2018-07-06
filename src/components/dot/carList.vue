<template>
    <div class="car-list">
        <div style="margin-bottom: 20px" >
            <el-button size="mini" type="text"  @click="$router.push('/dot/list')">返回</el-button>
        </div>

      
        <div>
           
            <el-table
                :data="tableData"
                @sort-change="sortChange"
                border
                style="width: 100%;margin-top:20px;">
        
                <el-table-column
                    label="车辆编码"
                    prop="carId">
                </el-table-column>

                <el-table-column              
                    label="车辆型号"
                    prop="model">
                </el-table-column>

                <el-table-column
                    label="车牌号"
                    prop="licenseTag">
                </el-table-column>

                <el-table-column
                    label="车辆状态"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row.statusName}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="收费等级"
                    prop="gradeName">
                    
                </el-table-column>
                

                <!-- <el-table-column
                    prop="status"
                    label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status===1">启用</span>
                        <span v-if="scope.row.status===2">禁用</span>
                        <span v-if="scope.row.status===0">待运营</span>
                    </template>
                </el-table-column> -->
                
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
    import message from '../../assets/js/message';

    import sourceSelect from '../common/sourceSelect';
    import {DOWN_URL,picUrl} from '../../config/app';
    import cp from '../../utils/checkPermissions';
    import exportExcel from '../../assets/js/exportExcel';
   
    
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
                filterForm:{
                    pageNum:1,
                    pageSize:20,
                    parkId:''
                },
                
                reqUrl:'/staff/park/findCar',
            
        
            }
        },
        created(){
           
        },
        mounted() {
           

            this.pageDataReq();
        
        
        },
        computed: {
            test:function () {
              
                this.tableData
                return this
            }
        },
        watch: {
            test(){
                if(this.tableData.length>0){
                    // this.handleDate()
                }
            }
        },
        filters:{
           
        },
        methods: {
            cp,
          
            handleDate(){
                this.tableData.forEach(tItem => {
                    let cityArr = [],cityIdArr = tItem.areaCode.split(',');
                    this.cityList.forEach(item => {
                        cityIdArr.forEach(idItem => {
                            if(item.baiduid == idItem){
                                cityArr.push(item.cityname) 
                            }
                        })
                        
                    });
                    tItem.areaCode = cityArr.join(',');
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
                this.filterForm.parkId = this.$route.query.parkId
                this.$store.dispatch('loadingAction',true);
                this.$http.post(this.reqUrl,this.filterForm).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                   
                    if (res.errCode === 0) {
                        this.tableData = res.attachment.carsList;
                        this.total = parseInt(res.attachment.totalCount);
                        //  console.log(this.tableData)
                    }else {
                        this.tableData = [];
                        this.page = 1;
                    }
                }).catch(err => {
                    console.log(err);
                    this.$store.dispatch('loadingAction',false);
                })
            },
          
         
            //切换分页
            handleCurrentChange(val) {
                this.pageNum=val;
                this.filterForm.pageNum = val;
                this.pageDataReq();
            },
            handleSizeChange(val){
                
                this.filterForm.pageSize = val;
                this.pageDataReq();
            },
           
            //搜索与重置
            search(swi){
                if(swi){
                    this.filterForm.pageNum = 1;
                    this.pageNum = 1;
                    this.pageDataReq();
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
                this.filterForm.pageNum = 1;
                this.pageNum = 1;
                this.pageDataReq();
            },
            
        },
        props: {},
      
    }
</script>
<style lang="less">
    .car-list {
        .search-form .el-form--inline .el-form-item__label{
            text-align: right;
            margin-top: 0px
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
