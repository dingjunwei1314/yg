<template>
    <div style="min-width: 865px" class="menu-set">
        <el-form>
            <el-form-item label="后台类型">
                <el-select v-model="platformType" @change="init" placeholder="请选择">
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
        <div class="tree-tr tree-title">
            <div>
                <span style="padding-left: 20px;padding-right: 20px">菜单</span>
                <el-button size="mini" type="success" round @click="append({})" >增加
                </el-button>
            </div>
            <div>
                <span class='tree-big-td'>操作
                </span><span class="tree-td">类型
                </span><span class="tree-td">图标
            </span><span class="tree-td">顺序
            </span><span class="tree-td">页面路径
            </span><span class="tree-td">api路径
            </span><span class="tree-big-td">授权标识</span>
            </div>
        </div>
        <el-tree
            ref="aa"
            :data="dataList"
            :props="defaultProps"
            node-key="menu_id"
            accordion
            :expand-on-click-node="false"
            :render-content="renderContent"
            :default-expanded-keys="expanded"
        >
        </el-tree>


        <!--修改弹框-->
        <el-dialog title="修改菜单" :visible.sync="editDialog">
            <el-form :model="form">
                <el-form-item label="菜单名称" :label-width="formLabelWidth">
                    <el-input v-model="form.menu_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.menu_type">
                        <el-radio-button :label="1">系统菜单</el-radio-button>
                        <el-radio-button :label="2">功能菜单</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="路径" :label-width="formLabelWidth" v-if="form.type==2">
                    <el-input v-model="form.page_url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="api路径" :label-width="formLabelWidth" v-if="form.type!=1">
                    <el-input v-model="form.api_url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="授权标识" :label-width="formLabelWidth">
                    <el-input v-model="form.tag" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="顺序" :label-width="formLabelWidth" v-if="form.type!=3">
                    <el-input v-model="form.menu_sort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" :label-width="formLabelWidth" v-if="form.type!=3">
                    <icon v-model="form.img"></icon>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button type="primary" @click="editFinsh()">确 定</el-button>
            </div>
        </el-dialog>

        <!--新增弹框-->
        <el-dialog title="新增菜单" :visible.sync="addDialog">
            <el-form :model="addform">
                <el-form-item label="名称"
                              :label-width="formLabelWidth">
                    <el-input v-model="addform.menu_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="addform.type">
                        <el-radio :label="1" v-show="parent_type == '1'">目录</el-radio>
                        <el-radio :label="2" v-show="parent_type == '1'">菜单</el-radio>
                        <el-radio v-show="parent_type == '2'" :label="3">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="addform.menu_type">
                        <el-radio-button :label="1">系统菜单</el-radio-button>
                        <el-radio-button :label="2">功能菜单</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="路径" :label-width="formLabelWidth" v-if="addform.type==2">
                    <el-input v-model="addform.page_url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="api路径" :label-width="formLabelWidth" v-if="addform.type==3">
                    <el-input v-model="addform.api_url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="授权标识" :label-width="formLabelWidth">
                    <el-input v-model="addform.tag" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="顺序" :label-width="formLabelWidth" v-if="addform.type!=3">
                    <el-input v-model="addform.menu_sort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" :label-width="formLabelWidth" v-if="addform.type!=3">
                    <icon v-model="addform.img"></icon>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="addFinsh()">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>


<script type="text/jsx">
    import icon from './icon';
    import message from '../../assets/js/message';
    export default {
        data() {
            return {
                platformType:'1',
                expanded:[],
                dataList: [],
                defaultProps: {
                    children: 'child',
                    label: 'name'
                },
                editDialog: false,
                addDialog: false,
                parent_type:'',
                form: {
                    menu_id:'',
                    menu_name:'',
                    menu_level:'',
                    parent_id:'',
                    menu_sort:'',
                    menu_type:'',
                    api_url:'',
                    tag:'',
                    page_url:'',
                    type:'',
                    img:''
                },
                addform: {
                    menu_name:'',
                    menu_level:'',
                    parent_id:'',
                    menu_sort:'',
                    menu_type:'',
                    api_url:'',
                    tag:'',
                    page_url:'',
                    type:'',
                    img:''
                },
                formLabelWidth: '80px',
            }
        },
        mounted() {
            this.init();
        },
        components: {
            icon
        },
        methods: {
            init() {
                this.$store.dispatch('loadingAction',true);
                this.$http.post('/system/menu/list',{},{},{platformType:this.platformType}).then((response) => {
                    this.$store.dispatch('loadingAction',false);
                    var res = response.data;
                    if (res.code === 200) {
                        this.dataList = res.data;
                    }
                }).catch(err => {
                    console.log(err);
                    this.$store.dispatch('loadingAction',false);
                })
            },
            editFinsh() {
                let editData = _.cloneDeep(this.form);
                if(editData.type == 3){
                    editData.perm_id = editData.menu_id;
                    editData.menu_id = editData.parent_id;
                    editData.perm_name = editData.menu_name;
                    delete editData.parent_id;
                    delete editData.menu_name;
                    delete editData.img;
                }else{
                    
                }
              
                // this.expanded=[editData.menu_id];
                
                let url = '/system/menu/edit';
                if (editData.type == 3) {
                    url = '/system/access/edit';
                    delete editData.menu_level;
                    delete editData.menu_sort;
                    delete editData.menu_type;
                }

                this.$http.post(url, editData, {},{platformType:this.platformType}).then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        this.editDialog = false;
                        message(this,'修改成功','success')
                        this.init();
                    }else {
                        message(this,res.message,'error')
                    }
                }).catch((error) => {

                });
            },
            edit(node, data) {
                for(let i in this.form){
                    this.form[i] = '';
                }
    
                this.form.menu_id = data.menu_id;
                this.form.menu_name = data.menu_name;
                this.form.menu_level = data.menu_level;
                this.form.parent_id = data.parent_id;
                this.form.menu_sort = data.menu_sort;
                this.form.menu_type = data.menu_type;
                this.form.api_url = data.api_url;
                this.form.tag = data.tag;
                this.form.page_url = data.page_url;
                this.form.type = data.type;
                this.form.img = data.img;
                if(data.type == 3){
                    this.form.page_url = '0';
                    this.form.img = '0';
                }else if(data.type == 1){
                    this.form.api_url = '0';
                    this.form.page_url = '0';
                }
                this.editDialog = true;
                
            },
            addFinsh() {
                let url = '/system/menu/add',
                data = _.cloneDeep(this.addform);
                if(data.type == 3){
                    url = '/system/access/add';
                    data.menu_id = data.parent_id;
                    data.perm_name = data.menu_name;
                    data.page_url = '0';
                    data.img = 'www';
                    data.menu_sort = '0';
                    delete data.parent_id;
                    delete data.menu_name;
                    delete data.img;
                    delete data.menu_level;
                    delete data.menu_sort;
                    delete data.menu_type;
                }else if(data.type == 2){
                    data.api_url = '0';
                }else{
                    data.api_url = '0';
                    data.page_url = '0';
                }

                // this.expanded=[data.menu_id];
                this.$http.post(url, data, {},{platformType:this.platformType}).then((response) => {
                    var res = response.data;
                    if (res.code === 200) {
                        message(this,'添加成功','success')
                        this.addDialog = false;
                        this.init();
                    } else {
                        message(this,res.message,'error')
                    }
                })
            },
            append(data,node) {
                
                this.parent_type = data.type? data.type:1;
                for(let i in this.addform){
                    this.addform[i] = '';
                }
                this.addDialog = true;
                this.addform.parent_id = data.menu_id?data.menu_id:0;
                this.addform.menu_level = node? node.level+1 : 1;
            },
            remove(node, data) {
                let msg1,msg2,status;
                if(data.status == 1){
                    msg1 = '确认禁用吗？';
                    msg2 = '禁用成功';
                    status = '2';
                }else{
                    msg1 = '确认开启吗？';
                    msg2 = '开启成功';
                    status = '1';
                }
                this.$confirm(msg1, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    var req = {
                        menu_id: data['menu_id'],
                        status
                    }

                    // this.expanded = [data['menu_id']]
                   
                  
                    this.$http.post('/system/menu/status', req,{},{platformType:this.platformType}).then((response) => {
                        var res = response.data;
                        if (res.code === 200) {
                            message(this,'修改成功','success')
                            this.init();
                        } else {
                            message(this,res.message,'error')
                        }
                    })
                }).catch((err) => {
                    console.log(err)
                });


            },
            renderContent(h, {node, data, store}) {
                return (
                    <div class='tree-tr'>
                        <div>
                            <span>{data.menu_name}{data.perm_name}</span>
                        </div>
                        <div>
                        <span class='tree-big-td'>
                            {data.type !=3? <el-button size="mini" type={data.status == '1' ? 'danger':'success'} round
                                       on-click={() => this.remove(node, data)}>{data.status == '1' ? '禁用':'开启'}</el-button>:''}
                            <el-button size="mini" type="primary" round
                                       on-click={() => this.edit(node, data)}>修改</el-button>
                            {data.type != 3 ?
                                <el-button size="mini" type="success" round on-click={() => this.append(data,node)}>
                                    增加</el-button> : ''}
                        </span>

                        <span class='tree-td'>{data.type ==='1'  ?
                            <el-tag type="success">目录</el-tag> : data.type === '2' ?
                                <el-tag type="warning">菜单</el-tag> : <el-tag type="info">按钮</el-tag>}</span>
                        <span class='tree-td'><span class={data.img}></span></span>
                        <span class='tree-td'>{data.type != 3?data.menu_sort:''}</span>
                        <span class='tree-td'>{data.type == 2?data.page_url:''}</span>
                        <span class='tree-td'>{data.type == 3?data.api_url:''}</span>
                        <span class='tree-big-td'>{data.type == 3?data.tag:''}</span>
                        </div>
                    </div>);
            }
        }
    };
</script>
<style lang="less">
    .menu-set{
        .el-dialog {
            .el-input, .el-select {
                width: 300px;
            }
        }

        .el-tree-node__content {
            height: 37px;
        }

        .el-tree-node {
            border: 1px solid #ddd;

            .el-tree-node {
                border-bottom: none;
                border-left: none;
                border-right: none;
            }

        }

        .tree-td {
            width: 80px;
            display: inline-block;
            border-left: 1px solid #ddd;
            padding-right: 8px;
            padding-left: 8px;
            height: 37px;
            line-height: 37px;
            vertical-align: middle;
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
        }

        .tree-big-td {
            .tree-td;
            width: 200px;
            text-align: left;
            padding-left: 5px;
        }

        .tree-tr {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
            height: 41px;
        }

        .tree-title {
            border: 1px solid #ddd;
            border-bottom: 0;
            background: #fff;
            span {
                font-weight: 900;
            }
        }
    }

</style>
