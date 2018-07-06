<template>
    <div class="carwash-add">
        <input 
        id="File"
        type="file" 
        style="display:none" 
        ref="importInput"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
        @change="importf($event)" />
       
        
        <el-row class="filter-form">
            <el-col>
                <el-button size="mini" type="text" @click="$router.push('/carwash/list')">返回</el-button>
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
                            <p>2、表格第一条数据所有项为必填，其余数据除联系人，联系电话，价格（元/小时）外其余项为必填；</p>
                            <p>3、城市：输入一个城市对应的编号，
                                <span v-for="item in city" :key="item.cityname"> {{item.baiduid}}：{{item.cityname}}；</span>
                            </p>  
                            <p>4、状态：状态输入对应编号1：启用，2：禁用；</p>
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
                    label="洗车房名称"
                    prop="washName">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.washNameValidate}">{{scope.row.washName}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="详细地址"
                    prop="address">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.addressValidate}">{{scope.row.address}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="经度"
                    prop="longitude">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.longitudeValidate}">{{scope.row.longitude}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="纬度"
                    prop="latitude">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.latitudeValidate}">{{scope.row.latitude}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="联系人"
                    prop="contactPerson">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.contactPersonValidate}">{{scope.row.contactPerson}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="联系电话"
                    prop="contactTel">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.contactTelValidate}">{{scope.row.contactTel}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="状态"
                    prop="status">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.statusValidate}">{{scope.row.status}}</p>
                    </template>
                </el-table-column>

                <el-table-column
                    label="价格（元/小时）"
                    prop="price">
                    <template slot-scope="scope">
                        <p :class="{'error-color':!scope.row.priceValidate}">{{scope.row.price}}</p>
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
                allCity:[],
                city:[],
                _flag:true
            }
        },
        mounted() {

            

            // this.a().then(res => {
            //     console.log(res)
            // })

    
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
           
            initCity(){
                this.$store.dispatch('GetCity').then(data => {
                    this.city = data
                    this.allCity = data.map(item => {
                        return item.baiduid
                    })
                    
                })
            },
            downExcel(){
                let title = ['城市', '洗车房名称', '详细地址', '经度', '纬度', '联系人', '联系电话', '状态', '价格（元）'],
                props = ['areaCode', 'washName', 'address', 'longitude', 'latitude', 'contactPerson', 'contactTel', 'status', 'price'],
                data=[{
                    areaCode: '131',
                    washName: '大望路洗车房',
                    address: '北京市朝阳区建外SOHO西区',
                    longitude: 1234567,
                    latitude: 1234567,
                    contactPerson:'张三',
                    contactTel: '18888888888',
                    status: 1,
                    price: 18
                }]
                exportExcel('洗车房模板', title, props, data)
            },
            selectError (val) {
                if(val){
                    let data = _.cloneDeep(this.tableData)
                    this.tableDataCope = data.filter(item => {
                        return !(item.areaCodeValidate && item.washNameValidate && item.addressValidate && item.longitudeValidate && item.latitudeValidate && item.contactPersonValidate && item.contactTelValidate && item.priceValidate && item.statusValidate)
                    })
                }else{
                    this.tableDataCope = _.cloneDeep(this.tableData)
                }
            },
            importClick () {
                this.$refs.importInput.click()
            },
            submit () {
                if (!this.flag) {
                    message(this, '有数据格式不符合要求', 'error')
                    return
                }
                if (!this._flag) {
                    message(this, '请先添加文件', 'error')
                    return
                }
                let d = _.cloneDeep(this.tableData)
                
                d.forEach(item => {
                    if (item.price) {
                        item.price = Math.ceil(item.price*100)
                    }
                    delete item.areaCodeValidate
                    delete item.washNameValidate
                    delete item.addressValidate
                    delete item.longitudeValidate
                    delete item.latitudeValidate
                    delete item.contactPersonValidate
                    delete item.contactTelValidate
                    delete item.statusValidate
                    delete item.priceValidate
                })
                
                // let data = {
                //     washList:JSON.stringify(d)
                // }
                this.$confirm('确认导入吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('loadingAction',true)
                    this.$http.post('/staff/washStation/massAdd', d, null, {serveType:1, args: d, module: 'staff'}).then((response)=>{
                        this.$store.dispatch('loadingAction', false)
                        var res = response.data
                        if (res.errCode === 0) {
                            message(this, res.message, 'success')
                        } else {
                            message(this, res.message, 'error')
                        }
                    }).catch(err => {
                        this.$store.dispatch('loadingAction', false)
                    })
                }).catch(() => {})
            },
            importf (obj) {// 导入
                var wb// 读取完成的数据
                var rABS = false// 是否将文件读取为二进制字符串
                var flag = true
                var file=document.getElementById('File')


                let contactTelReg = /^1[3|4|5|7|8|9][0-9]\d{8}$/

                this.fileInfo.name = ''
                this.checked = false
                if(!obj.target.files) {
                    message(this,'文件类型不符合要求','error')
                    return
                }
                var f = obj.target.files[0]
                this.fileInfo.name = f.name
                this.$refs.importInput.value = ''
                this.flag = true
              
                var reader = new FileReader()
                reader.onload = (e) => {
                 
                    var data = e.target.result
                    if(rABS) {
                        wb = XLSX.read(btoa(this.fixdata(data)), {//手动转化
                            type: 'base64'
                        })
                    } else {
                        wb = XLSX.read(data, {
                            type: 'binary'
                        })
                    }
                    //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
                    //wb.Sheets[Sheet名]获取第一个Sheet的数据
                   
                    let tabData = JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) )
                    this.tableData = JSON.parse(tabData)
                 
                    if(this.tableData[0]){
                        
                        let rightHeader = ['城市', '洗车房名称', '详细地址', '经度', '纬度', '联系人', '联系电话', '价格（元）','状态'],
                        header = Object.keys(this.tableData[0]),
                        flag2 = header.every(item => {
                            return rightHeader.includes(item)
                        })
                        if(flag2 && header.length === 9){
                            flag = true
                        }else{
                            flag = false
                        }
                    }else{
                        flag = false
                    }
                    this._flag = true
                    if(!flag){
                        message(this,'文件格式不符合要求,请重新上传','error')
                        this._flag = false
                        return
                    }

                    this.tableData.forEach(item => {
                        
                        item.areaCode = item['城市']
                        item.washName = item['洗车房名称']
                        item.address = item['详细地址']
                        item.longitude = item['经度']
                        item.latitude = item['纬度']
                        item.contactPerson = item['联系人']
                        item.contactTel = item['联系电话']
                        item.price = item['价格（元）']
                        item.status = item['状态']
                        delete item['城市']
                        delete item['洗车房名称']
                        delete item['城市详细地址']
                        delete item['经度']
                        delete item['纬度']
                        delete item['联系人']
                        delete item['有效半径（m）']
                        delete item['联系电话']
                        delete item['价格（元）']
                        delete item['状态']
                        
                        if(item.areaCode == undefined){
                            item.areaCodeValidate = false
                            this.flag = false
                        }else{
                            let areaCodeArr = item.areaCode.split(',')
                            item.areaCodeValidate = areaCodeArr.every( areaCodeItem => {
                                return this.allCity.includes(areaCodeItem)
                            })
                            if(!item.areaCodeValidate){
                                this.flag = false
                            }
                        }
                  

                        if(item.washName == undefined){
                            item.washNameValidate = false
                            this.flag = false
                        }else{
                           item.washNameValidate = true 
                           if (item.washName.length > 60) {
                               item.washNameValidate = false
                               this.flag = false
                           } else {
                               item.washNameValidate = true 
                           }
                        }

                        if(item.address == undefined){
                            item.addressValidate = false
                            this.flag = false
                        }else{
                           if (item.address.length > 120) {
                               item.addressValidate = false
                               this.flag = false
                           } else {
                               item.addressValidate = true 
                           }
                        }

                        if(item.longitude == undefined){
                            item.longitudeValidate = false
                            this.flag = false
                        }else{
                            if(isNaN(Number(item.longitude))){
                                item.longitudeValidate = false
                                this.flag = false
                            }else{
                               item.longitudeValidate = true 
                            }
                        }

                        if(item.latitude == undefined){
                            item.latitudeValidate = false
                            this.flag = false
                        }else{
                            if(isNaN(Number(item.latitude))){
                                item.latitudeValidate = false
                                this.flag = false
                            }else{
                               item.latitudeValidate = true 
                            }
                        }

                        if(item.contactPerson == undefined){
                            item.contactPersonValidate = true
                        }else{
                            if(item.contactPerson.length <= 20){
                                item.contactPersonValidate = true
                            }else{
                                item.contactPersonValidate = false
                                this.flag = false
                            }
                        }

                        if(item.contactTel == undefined){
                            item.contactTelValidate = true
                        }else{
                            if(contactTelReg.test(item.contactTel)){
                                item.contactTelValidate = true
                            }else{
                                item.contactTelValidate = false
                                this.flag = false
                            }
                        }

                        if(item.price == undefined){
                            item.priceValidate = true
                        }else{
                            if(isNaN(Number(item.price))){
                                item.priceValidate = false
                                this.flag = false
                            }else{
                               if (item.price <= 0 || item.price > 999999) {
                                   item.priceValidate = false
                                   this.flag = false
                               } else {
                                   
                                   if (Number.isInteger(Number(item.price))) {
                                       item.priceValidate = true
                                   } else {
                                       if (item.price.toString().split(".")[1].length > 2) {
                                            item.priceValidate = false
                                            this.flag = false
                                       } else {
                                           item.priceValidate = true
                                       }
                                   }
                               }
                            }
                        }

                        if(item.status == 1 || item.status == 2){
                            item.statusValidate = true
                        }else{
                            item.statusValidate = false
                            this.flag = false
                        }

                        

                    })
                   
                    this.tableDataCope = _.cloneDeep(this.tableData)
                    
                }
                if(rABS) {
                    reader.readAsArrayBuffer(f)
                } else {
                    reader.readAsBinaryString(f)
                }

                
            },
            fixdata(data) { //文件流转BinaryString
                var o = "",
                    l = 0,
                    w = 10240
                for( ;l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
                return o
            },
        },
        props: {},
        watch: {}
    }
</script>
<style lang="less">
    .carwash-add{
        .error-color{
            background: red;
            min-height: 25px
        }
    }
</style>
