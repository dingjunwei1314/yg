<template>
    <div class="gserve-add">
        <input 
        id="File"
        type="file" 
        style="display:none" 
        ref="importInput"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
        @change="importf($event)" />
       
        
        <el-row class="filter-form">
            <el-col>
                <el-button size="mini" type="text" @click="$router.push('/gservice/list')">返回</el-button>
                <el-form label-width="100px">
                    <el-form-item label="上传文件：">
                        <span>{{fileInfo.name}}</span>
                        <el-button size="mini" @click="importClick">浏览</el-button>
                        <el-button v-show="fileInfo.name" size="mini" type="primary" @click="submit">导入</el-button>
                        <p>请按照需要格式上传，<el-button type="text" @click="downExcel">点击下载上传模板</el-button></p>
                    </el-form-item>
                    <el-form-item label="上传文件说明：">
                        <div style="">
                            <p>1、表头不能修改、增加、变更、删除，否则会上传失败；</p>
                            <p>2、全部为必填项；</p>
                            <p>3、城市：可输入多个城市对应的编号，用英文;隔开，
                                <span v-for="item in city" :key="item.cityname"> {{item.baiduid}}：{{item.cityname}}；</span>
                            </p>
                            <p>4、手机号不可重复；</p>
                            <p>5、准驾车型输入标准：A1、A2、A3、B1、B2、C1、C2、C3、C4</p>
                            <p>6、驾驶证到期日格式：2018-02-08</p>
                            <p>7、地服供应商名称请输入对应编号，只能输入一个：  <span v-for="item in groundCompany" :key="item.full_name"> {{item.id}}：{{item.full_name}}；</span></p>
                            <p>8、可接工单业务类型请输入对应的编号，用英文;隔开，
                                <span v-for="item in workOrder" v-if="item.code!=13" :key="item.name"> {{item.code}}：{{item.name}}；</span>
                            </p>
                        </div>

                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <div>
            <el-checkbox v-if="fileInfo.name" @change="selectError" v-model="checked">只显示错误的</el-checkbox>
            <el-table 
                v-if="fileInfo.name"
                :data="tableDataCope"
                border
                style="width: 100%;margin-top:20px;">

                <el-table-column
                label="序号"
                type="index"
                width="50">
                </el-table-column>

                <el-table-column
                    label="城市"
                    prop="areaCode">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.areaCodeValidate}">{{scope.row.areaCode}}</p>
                    </template>
                </el-table-column>
                
                <el-table-column
                    label="姓名"
                    prop="name">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.nameValidate}">{{scope.row.name}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="手机号"
                    prop="phoneNum">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.phoneNumValidate}">{{scope.row.phoneNum}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="身份证号"
                    prop="identityCardNum">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.identityCardNumValidate}">{{scope.row.identityCardNum}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="驾照档案编号"
                    prop="driverLicenseFileNo">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.driverLicenseFileNoValidate}">{{scope.row.driverLicenseFileNo}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="准驾车型"
                    prop="driverLicenseLevel">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.driverLicenseLevelValidate}">{{scope.row.driverLicenseLevel}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="驾驶证到期日"
                    prop="driverLicenseValid">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.driverLicenseValidValidate}">{{scope.row.driverLicenseValid}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="地服供应商名称"
                    prop="groundServiceCompanyId">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.groundServiceCompanyIdValidate}">{{scope.row.groundServiceCompanyId}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="可接工单业务类型"
                    prop="orderType">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.orderTypeValidate}">{{scope.row.orderType}}</p>
                    </template>
                </el-table-column>
              
            </el-table>
        </div>


    </div>
</template>


<script>
    import qs from 'qs'
    import message from '../../assets/js/message'
    import cp from '../../utils/checkPermissions'
    import exportExcel from '../../assets/js/exportExcel';
    export default {
        data() { 
            return {
                fileInfo:{
                    name:''
                },
                checked:false,
                tableData: [],//列表数据
                tableDataCope:[],
                driveLevel:[],
                groundCompanyList:[],
                groundCompany:[],
                workOrderType:[],
                workOrder:[],
                allCity:[],
                city:[]
            }
        },
        mounted() {

            

            // this.a().then(res => {
            //     console.log(res)
            // })

            this.initDriverLevel()
            this.initGroundCompanyList()
            this.initWorkOrderType()
            this.initCity()
        },
        methods: {
            // async a(){
            //     console.log(0)
            //     await (function(){
            //         return new Promise((reslove) => {
            //             setTimeout(() => {
            //                 console.log(1)
            //                 reslove(1)
            //             },2000)
            //         })
            //     })();
            //     console.log(2)
            // },
            initDriverLevel(){
                this.$store.dispatch('GetDriverLevel').then(data => {
                    this.driveLevel = Object.values(data);
                })
            },
            initGroundCompanyList(){
                this.$store.dispatch('GetGroundCompanyList').then(data => {
                    this.groundCompany = data;
                    this.groundCompanyList = data.map(item => {
                        return item.id;
                    })
                })
            }, 
            initWorkOrderType(){
                this.$store.dispatch('GetWorkOrderType').then(data => {
                    this.workOrder = data;
                    
                    this.workOrderType = data.map(item => {
                        return item.code;
                    })
                    
                })
            },
            initCity(){
                this.$store.dispatch('GetCity').then(data => {
                    this.city = data;
                    this.allCity = data.map(item => {
                        return item.baiduid;
                    })
                    
                })
            },
            downExcel(){
                let title = ['姓名','手机号','城市','身份证号','驾照档案编号','准驾车型','驾驶证到期日','地服供应商名称','可接工单业务类型'],
                props=['name','phoneNum','areaCode','identityCardNum','driverLicenseFileNo','driverLicenseLevel','driverLicenseValid','groundServiceCompanyId','orderType'],
                data=[{
                    name:'张三',
                    phoneNum:'18888888888',
                    areaCode:'158;236',
                    identityCardNum:'110111199001011239',
                    driverLicenseFileNo:'88888',
                    driverLicenseLevel:'A1',
                    driverLicenseValid:'2018-10-01',
                    groundServiceCompanyId:'2',
                    orderType:'1;2;3;4'
                }]
                exportExcel('地服人员模板',title,props,data);
            },
            selectError(val){
                if(val){
                    let data = _.cloneDeep(this.tableData)
                    this.tableDataCope = data.filter(item => {
                        return !(item.nameValidate&&item.phoneNumValidate&&item.areaCodeValidate&&item.identityCardNumValidate&&item.driverLicenseFileNoValidate&&item.driverLicenseValidValidate&&item.driverLicenseLevelValidate&&item.groundServiceCompanyIdValidate&&item.orderTypeValidate)
                    })
                }else{
                    this.tableDataCope = _.cloneDeep(this.tableData)
                }
            },
            importClick(){
                this.$refs.importInput.click()
            },
            submit(){
                if(!this.flag){
                    message(this,'有数据格式不符合要求','error')
                    return;
                }
                let d = _.cloneDeep(this.tableData);
                d.forEach(item => {
                    delete item.nameValidate
                    delete item.phoneNumValidate
                    delete item.areaCodeValidate
                    delete item.identityCardNumValidate
                    delete item.driverLicenseFileNoValidate
                    delete item.driverLicenseValidValidate
                    delete item.driverLicenseLevelValidate
                    delete item.groundServiceCompanyIdValidate
                    delete item.orderTypeValidate
                    item.areaCode = item.areaCode.split(';').join(',')
                    item.orderType = item.orderType.split(';').join(',')
                })
                let data = {
                    userList:JSON.stringify(d)
                }
                this.$confirm('确认导入吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('loadingAction',true);
                    this.$http.post('/staff/user/massAdd',data,{type:'payload'}).then((response)=>{
                        this.$store.dispatch('loadingAction',false);
                        var res = response.data;
                        if (res.errCode === 0) {
                            message(this,res.message,'success')
                        } else {
                            message(this,res.message,'error')
                        }
                    }).catch(err => {
                        this.$store.dispatch('loadingAction',false);
                    })

                }).catch(() => {
                });
            },
            importf(obj) {//导入
             

                var wb;//读取完成的数据
                var rABS = false; //是否将文件读取为二进制字符串
                var flag = true;
                var file=document.getElementById('File');


                let phoneNumReg = /^1[3|4|5|7|8|9][0-9]\d{8}$/,
                    checkIdentityCardNumReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 

                this.fileInfo.name = '';
                this.checked = false;
                if(!obj.target.files) {
                    message(this,'文件类型不符合要求','error');
                    return;
                }
                var f = obj.target.files[0];
                this.fileInfo.name = f.name
                this.$refs.importInput.value = '';
                this.flag = true;
              
                var reader = new FileReader();
                reader.onload = (e) => {
                 
                    var data = e.target.result;
                    if(rABS) {
                        wb = XLSX.read(btoa(this.fixdata(data)), {//手动转化
                            type: 'base64'
                        });
                    } else {
                        wb = XLSX.read(data, {
                            type: 'binary'
                        });
                    }
                    //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                    //wb.Sheets[Sheet名]获取第一个Sheet的数据
                    let tabData = JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
                    this.tableData = JSON.parse(tabData);

                 
                    if(this.tableData[0]){
                        let rightHeader = ['姓名','手机号','城市','身份证号','驾照档案编号','准驾车型','驾驶证到期日','地服供应商名称','可接工单业务类型'],
                        header = Object.keys(this.tableData[0]),
                        flag2 = header.every(item => {
                            return rightHeader.includes(item)
                        });
                        if(flag2 && header.length === 9){
                            flag = true;
                        }else{
                            flag = false;
                        }
                    }else{
                        flag = false;
                    }

                    if(!flag){
                        message(this,'文件格式不符合要求,请重新上传','error')
                        return;
                    }

                    this.tableData.forEach(item => {
                        
                        item.name = item['姓名'];
                        item.phoneNum = item['手机号'];
                        item.areaCode = item['城市'];
                        item.identityCardNum = item['身份证号'];
                        item.driverLicenseFileNo = item['驾照档案编号'];
                        item.driverLicenseLevel = item['准驾车型'];
                        item.driverLicenseValid	 = item['驾驶证到期日'];
                        item.groundServiceCompanyId = item['地服供应商名称'];
                        item.orderType = item['可接工单业务类型'];
                        delete item['姓名'];
                        delete item['手机号'];
                        delete item['城市'];
                        delete item['身份证号'];
                        delete item['驾照档案编号'];
                        delete item['准驾车型'];
                        delete item['驾驶证到期日'];
                        delete item['地服供应商名称'];
                        delete item['可接工单业务类型'];

                        if(item.name == undefined || item.name.length>20){
                            item.nameValidate = false;
                            this.flag = false;
                        }else{
                           item.nameValidate = true; 
                        }

                        if(item.phoneNum == '' || !phoneNumReg.test(item.phoneNum)){
                            item.phoneNumValidate = false;
                            this.flag = false;
                        }else{
                            item.phoneNumValidate = true;
                        }

                        if(item.areaCode == undefined){
                            item.areaCodeValidate = false;
                            this.flag = false;
                        }else{
                            let areaCodeArr = item.areaCode.split(';');
                            item.areaCodeValidate = areaCodeArr.every( areaCodeItem => {
                                return this.allCity.includes(areaCodeItem)
                            })
                            if(!item.areaCodeValidate){
                                this.flag = false
                            }
                        }

                        if(item.identityCardNum == '' || !checkIdentityCardNumReg.test(item.identityCardNum)){
                            item.identityCardNumValidate = false;
                            this.flag = false;
                        }else{
                            item.identityCardNumValidate = true;
                        }

                        if(item.driverLicenseFileNo == undefined || item.driverLicenseFileNo.length>40){
                            item.driverLicenseFileNoValidate = false;
                            this.flag = false;
                        }else{
                           item.driverLicenseFileNoValidate = true; 
                        }

                        if(item.driverLicenseValid == undefined){
                            item.driverLicenseValidValidate = false;
                            this.flag = false;
                        }else{
                           if(new Date(item.driverLicenseValid).valueOf()){
                               if(item.driverLicenseValid.indexOf('/')>0){
                                   item.driverLicenseValidValidate = false;
                                   this.flag = false;
                               }else{
                                   item.driverLicenseValidValidate = true;
                               }    
                           }else{
                               item.driverLicenseValidValidate = false;
                               this.flag = false;
                           }
                        }
                        // console.log(this.groundCompanyList)
                        if(item.driverLicenseLevel == undefined || !this.driveLevel.includes(item.driverLicenseLevel)){
                            item.driverLicenseLevelValidate = false;
                            this.flag = false;
                        }else{
                           item.driverLicenseLevelValidate = true; 
                        }

                        if(item.groundServiceCompanyId == undefined || !this.groundCompanyList.includes(item.groundServiceCompanyId)){
                            item.groundServiceCompanyIdValidate = false;
                            this.flag = false;
                        }else{
                           item.groundServiceCompanyIdValidate = true; 
                        }

                        if(item.orderType == undefined){
                            item.orderTypeValidate = false;
                        }else{
                            let orderTypeArr = item.orderType.split(';');
                            item.orderTypeValidate = orderTypeArr.every( orderTypeItem => {
                                return this.workOrderType.includes(orderTypeItem)
                            })
                            if(!item.orderTypeValidate){
                                this.flag = false;
                            }
                        }

                    })

                    this.tableDataCope = _.cloneDeep(this.tableData)
                    
                };
                if(rABS) {
                    reader.readAsArrayBuffer(f);
                } else {
                    reader.readAsBinaryString(f);
                }

                
            },
            fixdata(data) { //文件流转BinaryString
                var o = "",
                    l = 0,
                    w = 10240;
                for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
                return o;
            },
        },
        props: {},
        watch: {}
    }
</script>
<style lang="less">
    .gserve-add{
        .error-color{
            background: red;
            min-height: 25px
        }
    }
</style>
