<template>
    <div style="min-width: 865px" class="dept-set">
        <div class="tree-tr tree-title">
            <div>
                <span style="padding-left: 20px;padding-right: 20px">部门</span>
            </div>
            <div>
                <span class='tree-big-td'>操作
                </span><span class="tree-td">上级部门
            </span>
            </div>
        </div>
        <el-tree
            :data="dataList"
            :props="defaultProps"
            node-key="deptId"
            accordion
            :expand-on-click-node="false"
            :default-expanded-keys="expanded"
            :render-content="renderContent">
        </el-tree>


        <!--修改弹框-->
        <el-dialog title="修改菜单" :visible.sync="editDialog">
            <el-form :model="form">
                <el-form-item label="部门名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
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
                <el-form-item label="部门名称" :label-width="formLabelWidth">
                    <el-input v-model="addform.name" auto-complete="off"></el-input>
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
    import icon from './icon'

    let id = 1000;
    let editData = {};
    let addData = {};

    export default {
        data() {
            return {
                expanded: [],
                dataList: [],
                defaultProps: {
                    children: 'list',
                    label: 'name'
                },
                editDialog: false,
                addDialog: false,
                form: {
                    name: '',
                    orderNum: '',
                },
                addform: {
                    name: '',
                    orderNum: '',
                    deptId: (new Date()).getTime()
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
                this.$http.get('/dc-admin/sys/dept/list').then((response) => {
                    var res = response.data;
                    if (res.code == 0) {
                        this.dataList = [res.dept];
                    }
                }).catch((error) => {

                });
            },
            editFinsh() {
                this.editDialog = false;
                editData.name = this.form.name;
                this.expanded = [editData.deptId];

                this.$http.post('/dc-admin/sys/dept/update', editData, {type: 'payload'}).then((response) => {
                    var res = response.data;
                    if (res.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                        this.init();

                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                }).catch((error) => {

                });

            },
            edit(node, data) {
                this.editDialog = true;
                editData = {
                    "name": data.name,
                    "parentId": data.parentId,
                    "orderNum": data.orderNum,
                    "deptId": data.deptId,
                }
                this.form = JSON.parse(JSON.stringify(data));
            },
            addFinsh() {

                this.expanded = [this.addform.parentId];
                this.$http.post('/dc-admin/sys/dept/save', this.addform, {type: 'payload'}).then((response) => {
                    var res = response.data;
                    if (res.code == 0) {
                        this.$message({
                            type: 'success',
                            message: '新增成功'
                        });
                        this.addDialog = false;
                        this.init();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                })
            },
            append(data) {
                this.addDialog = true;
                addData = data;
                this.addform = {
                    name: '',
                    orderNum: 0,
                    deptId: 0,
                    parentId: data ? data.deptId : 0
                }
            },
            remove(node, data) {

                this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const parent = node.parent;
                    const children = parent.data.list || parent.data;
                    const index = children.findIndex(d => d.deptId === data.deptId);

                    var req = {
                        deptId: children[index]['deptId']
                    }

                    this.expanded = [parent.data.deptId];
                    this.$http.post('/dc-admin/sys/dept/delete', req).then((response) => {
                        var res = response.data;
                        if (res.code == 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });

                            this.init();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            renderContent(h, {node, data, store}) {
                return (
                    <div class='tree-tr'>
                        <div>
                            <span>{data.name}</span>
                        </div>
                        <div>
                        <span class='tree-big-td'>
                            <el-button size="mini" type="danger" round
                                       on-click={() => this.remove(node, data)}>删除</el-button>
                            <el-button size="mini" type="primary" round
                                       on-click={() => this.edit(node, data)}>修改</el-button>
                            <el-button size="mini" type="success" round
                                       on-click={() => this.append(data)}>增加</el-button>
                        </span>
                            <span class='tree-td'>{data.parentName}</span>
                        </div>
                    </div>);
            }
        }
    };
</script>
<style lang="less">
    .dept-set {
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
            width: 180px;
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
