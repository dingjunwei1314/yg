<template>
    <div class="role-sys">
        <div v-show="!flag">
            <div style="margin-bottom: 20px">
                <el-form>
                    <el-form-item label="后台类型">
                        <el-select v-model="platformType" @change="refresh" placeholder="请选择">
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
                <el-button v-if="cp('--/access/role/add')" size="mini" type="primary" @click="append">增加</el-button>
                <el-button size="small" @click="refresh">刷新</el-button>
            </div>
            <el-table 
                    :data="tableData"
                    border>
                <el-table-column
                    label="操作"
                    min-width="120">
                    <template slot-scope="scope">
                        <div v-if="scope.row.role_id!='1'">
                            <el-button v-if="cp('--/access/role/edit')" size="mini" type="primary" @click="edit(scope.row)">修改</el-button>
                            <el-button v-if="cp('--/access/role/config')" size="mini" type="primary" @click="distribution(scope.row)">分配权限</el-button>
                            <el-button v-if="cp('--/access/role/status')" size="mini" :type="scope.row.status=='1'?'danger':'primary'"  @click="forbidden(scope.row)">
                                <span v-if="scope.row.status=='1'">禁用</span>
                                <span v-else>启用</span>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="role_id"
                    label="ID">
                </el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色名称">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='1'">启用</span>
                        <span v-if="scope.row.status=='2'">禁用</span>
                    </template>
                </el-table-column>
                <el-table-column 
                    prop="create_time" 
                    label="创建时间">
                </el-table-column>
            </el-table>
            
            <div style="text-align:center;margin-top:30px">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="page"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <!--新增-->
        <div v-show="flag=='add' || flag=='edit'" class="addbox">
            <el-form ref="form" :model="addEditForm" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="addEditForm.role_name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addEditFinish">
                        <span v-if="flag=='add'">立即创建</span>
                        <span v-if="flag=='edit'">立即修改</span>
                    </el-button>
                    <el-button @click="flag = ''">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--修改-->
        <div v-show="flag=='distribution'" class="addbox">
            <el-form ref="form" :model="editForm" label-width="80px">
                <el-form-item label="角色名称">
                    {{editForm.role_name}}
                </el-form-item>

                <el-form-item label="所属城市" class="city">
                    <citys :cityids.sync="editForm.city_ids" />
                </el-form-item>

                <el-form-item label="菜单权限">
                    <el-checkbox v-model="checkedMenu" @change="allMenu">全选</el-checkbox>
                    <el-tree
                        style="margin-top:10px"
                        :data="menuList"
                        show-checkbox
                        @check="checkChange"
                        default-expand-all
                        node-key="menu_id"
                        ref="menuList"
                        :default-checked-keys="dcks"
                        highlight-current
                        :props="defaultProps">
                    </el-tree>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="distributionFinish">确认修改</el-button>
                    <el-button @click="flag = ''">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import message from '../../assets/js/message';
    import citys from '../common/citys';
    import cp from '../../utils/checkPermissions'
    export default {
        components:{
            citys
        },
        data() {
            return {
                platformType: '1',
                page:1,
                total:0,
                tableData: [],
                menuList: [],
                menuListIds:[],
                selfMenuListIds:[],
                dcks:[],
                checkedMenu:false,
                flag: '',//add-新增  edit-编辑   ''-列表状态
                filterForm:{
                    pageSize:10,
                    page:1
                },
                addEditForm: {
                    role_id:'',
                    role_name: '',
                    status:1
                },//新增form
                editForm: {
                    role_id:'',
                    role_name: '',
                    city_ids:[],
                    menu_ids:[],
                    perm_ids:[]
                },//编辑form
                defaultProps: {
                    children: 'child',
                    label: 'menu_name'
                },
            }
        },
        mounted() { 
            this.initList()
        },
        methods: {
            cp,
            initList () {
                this.$store.dispatch('loadingAction',true);
                this.$http.post('/access/role/list',this.filterForm,{},{platformType:this.platformType}).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                    if (res.code === 200) {
                        this.tableData = res.data.data
                        this.total = res.data.total
                    }else{
                        message(this,res.message,'error')
                    }
                });
            },
            handleCurrentChange (val) {
                this.filterForm.page = val
                this.page = val
                this.initList()
            },
            menuInit(role_id) {
                this.$store.dispatch('loadingAction',true);
                this.$http.post('/access/role/config-list',{role_id},{},{platformType:this.platformType}).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                    if (res.code === 200) {
                        this.menuList = res.data;
                        this.initDefaultProps(this.menuList);
                        this.checkedMenu = this.menuListIds.length === this.selfMenuListIds.length;
                    }else{
                        message(this,res.message,'error')
                    }
                });
            },
            initDefaultProps(data){
                data.forEach((item,index) => {
                    if(item.type === '3'){
                        item.menu_id += 'b'
                    }else{
                        item.menu_id += 'a'
                    }
                    this.menuListIds.push(item.menu_id);
                    if(item.isHave === '1'){
                        this.selfMenuListIds.push(item.menu_id);
                        if(item.type === '3'){
                            this.dcks.push(item.menu_id);
                        }else{
                            if(!item.child || item.child.length==0){
                                this.dcks.push(item.menu_id);
                            }
                        }
                    }
                    if(item.child && item.child.constructor === Array){
                        this.initDefaultProps(item.child);
                    }
                });
            },
            //点击新增角色 
            append() {
                this.flag = 'add';
                this.addEditForm.role_name = '';
            },
            //刷新
            refresh(){
                this.filterForm.page = 1;
                this.page = 1;
                this.initList();
            },
            edit(row) {
                this.flag='edit';
                this.addEditForm.role_id = row.role_id;
                this.addEditForm.role_name = row.role_name;
            },
            addEditFinish() {
                let url,msg,data = _.cloneDeep(this.addEditForm);
                if(this.flag == 'add'){
                    url = '/access/role/add';
                    msg = '新增成功';
                    delete data.role_id;
                }else if(this.flag == 'edit'){
                    url = '/access/role/edit';
                    msg = '修改成功';
                    delete data.status;
                }
                this.$store.dispatch('loadingAction',true);
                this.$http.post(url,data,{},{platformType:this.platformType}).then((response)=>{
                    this.$store.dispatch('loadingAction',false);
                    var res= response.data;
                    if(res.code === 200){
                        this.flag='';
                        message(this,msg,'success')
                        this.initList();
                    }else {
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    this.$store.dispatch('loadingAction',false);
                })
            },
            //全选
            allMenu(val){
                this.$refs.menuList.setCheckedKeys(val?this.menuListIds:[])
            },
            checkChange(a,b){
                this.checkedMenu = (b.checkedKeys.length+b.halfCheckedKeys.length === this.menuListIds.length)
            },
            //分配权限
            distribution(row){
                this.checkedMenu = false;
                this.flag = 'distribution';
                this.editForm.role_id = row.role_id;
                this.editForm.role_name = row.role_name;
                this.editForm.city_ids = row.city_ids.split(',');
                this.dcks = [];
                this.$refs.menuList.setCheckedKeys([]);
                this.menuListIds = [];
                this.selfMenuListIds = [];
                this.menuInit(row.role_id);
            },
            distributionFinish() {
                let idsArray = [...this.$refs.menuList.getCheckedKeys(),...this.$refs.menuList.getHalfCheckedKeys()],data;
                this.editForm.menu_ids = [];
                this.editForm.perm_ids = [];
                data = _.cloneDeep(this.editForm);
                for(let i of idsArray){
                    if(i.slice(-1) == 'a'){
                        data.menu_ids.push(i.slice(0,-1))
                    }else{
                        data.perm_ids.push(i.slice(0,-1))
                    }
                }
                data.menu_ids = data.menu_ids.join(',');
                data.perm_ids = data.perm_ids.join(',');
                data.city_ids = data.city_ids.join(',');
                this.$store.dispatch('loadingAction',true);
                this.$http.post('/access/role/config',data,{},{platformType:this.platformType}).then((response)=>{
                    this.$store.dispatch('loadingAction',false);
                    var res= response.data;
                    if(res.code === 200){
                        this.flag='';
                        message(this,'更新成功','success')
                        this.initList();
                    }else {
                        message(this,res.message,'error')
                    }
                }).catch(err => {
                    this.$store.dispatch('loadingAction',false);
                })
            },
            //禁用
            forbidden(row) {
                let msg1,msg2,url='/access/role/status',data={role_id:row.role_id};
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
                    this.$http.post(url,data,{},{platformType:this.platformType}).then((response)=>{
                        this.$store.dispatch('loadingAction',false);
                        var res = response.data;
                        if (res.code === 200) {
                            message(this,msg2,'success')
                            this.initList();
                        } else {
                            message(this,res.message,'error')
                        }
                    }).catch(err => {
                        this.$store.dispatch('loadingAction',false);
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
    .role-sys {
        .city .el-checkbox{
            margin-left: 0px
        }
        .addbox {
            width: 100%;
            background: white;
            padding: 20px;

            .el-form {
                width: 60%;
            }

            .choosedept {
                .el-button {
                    width: 100%;
                }
            }
        }

    }


</style>