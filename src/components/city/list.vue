<template>
    <div class="role-sys" style="width:100%">
        <div style="width:100%">
            <div style="margin-bottom: 20px">
                <el-button size="mini" v-if="cp('--/city/city/add')" type="primary" @click="addDialog=true">增加</el-button>
                <el-button size="small" @click="refresh">刷新</el-button>
            </div>
            <el-table   
                    :data="tableData"
                    style="width:100%"
                    border>
                <el-table-column
                    label="操作"
                    min-width="120">
                    <template slot-scope="scope">
                        <div v-if="scope.row.role_id!='1'">
                            <el-button v-if="cp('--/city/city/status')" size="mini" :type="scope.row.is_enable=='1'?'danger':'primary'"  @click="forbidden(scope.row)">
                                <span v-if="scope.row.is_enable=='1'">禁用</span>
                                <span v-else>启用</span>
                            </el-button>
                            <el-button size="mini" v-if="cp('--/city/seten')" type="primary"  @click="setEnclosure('/city/setenclosure',scope.row.cityname,scope.row.baiduid)">
                                围栏设置
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="120"
                    prop="citycode"
                    label="百度Code">
                </el-table-column>
                <el-table-column
                    min-width="120"
                    prop="baiduid"
                    label="百度Id">
                </el-table-column>
                <el-table-column 
                    min-width="120"
                    prop="cityname" 
                    label="城市名称">
                </el-table-column>
                <el-table-column min-width="120" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_enable=='1'">启用</span>
                        <span v-if="scope.row.is_enable=='0'">禁用</span>
                    </template>
                </el-table-column>
            </el-table>

            <div style="text-align:center;margin-top:30px">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="page"
                    :page-sizes="pagesizes"
                    :page-size="10"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <!--新增-->
        <el-dialog title="新增" :visible.sync="addDialog">
            <el-form :model="allForm" :inline="true" style="padding:20px">
                <el-form-item label="城市名">
                    <el-input v-model="allForm.name" size="small" style="width:155px"></el-input>
                    <el-button size="small" type="primary" @click="search">搜索</el-button>
                </el-form-item>
            </el-form>
            <div class="addbox">
                <el-table 
                    v-loading="loading"
                    :data="allTableData"
                    border>
                    <el-table-column
                        label="操作"
                        min-width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.role_id!='1'">
                                <el-button size="mini" type="primary"  @click="forbidden(scope.row,2)">
                                    <span>启用</span>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        prop="cityname" 
                        label="城市名称">
                    </el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.is_enable=='1'">启用</span>
                            <span v-if="scope.row.is_enable=='0'">禁用</span>
                        </template>
                    </el-table-column>
                </el-table>

                <div style="text-align:center;margin-top:30px">
                    <el-pagination
                        @current-change="allHandleCurrentChange"
                        :current-page.sync="allPage"
                        :page-size="10"
                        layout="total, prev, pager, next, jumper"
                        :total="allTotal">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import pageination from '../../assets/js/mixins/pagination';
    import message from '../../assets/js/message';
    import citys from '../common/citys';
    import cp from '../../utils/checkPermissions'
    export default {
        mixins:[pageination],
        components:{
            citys
        },
        data() {
            return {
                loading:false,
                reqUrl:'/city/city/list',
                addDialog:false,
                allPage:1,
                allTotal:0,
                allTableData:[],
                filterForm:{
                    pageSize:10,
                    page:1,
                    
                },
                allForm:{
                    pageSize:10,
                    page:1,
                    name:''
                }
            }
        },
        mounted() {
           this.allInit()
        },
        methods: {
            cp,
            allHandleCurrentChange(page){
                this.allForm.page = page;
                this.allInit();
            },
            search(){
                this.allPage = 1;
                this.allForm.page = 1;
                this.allInit()
            },
            //刷新
            refresh(){
                this.filterForm.page = 1;
                this.page = 1;
                this.allInit();
            },
            allInit(){
                let data = _.cloneDeep(this.allForm);
                data.where = 'name='+data.name;
                delete data.name;
                this.$store.dispatch('loadingAction',true);
                this.$http.post('/city/city/add',data).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                    if (res.code === 200) {
                        this.allTableData = res.data.data;
                        this.allTotal=parseInt(res.data.total);
                    }else {
                        this.allTableData=[];
                        this.allPage=1;
                    }
                }).catch(err => {
                    this.$store.dispatch('loadingAction',false);
                })
            },
            //禁用
            forbidden(row) {
                
                let msg1,msg2,url='/city/city/status',data={baiduid:row.baiduid};
                if(row.is_enable == 1){
                    msg1 = '确认禁用吗?';
                    msg2 = '禁用成功';
                    data.is_enable = '0'
                }else{
                    msg1 = '确认启用吗?';
                    msg2 = '启用成功';
                    data.is_enable = '1'
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
                            this.allInit()
                        } else {
                            message(this,res.message,'error')
                        }

                    }).catch(err => {
                        this.$store.dispatch('loadingAction',false);
                    })

                }).catch(() => {
                });
            },
            //设置围栏
            setEnclosure(path,cityname,baiduid){
                this.$router.push({
                    path,
                    query:{
                        cityname,
                        baiduid
                    }
                })
            }
        },
        props: {},
        watch: {}
    }
</script>
<style lang="less">
    .el-table__header{width: 100%!important}


</style>
