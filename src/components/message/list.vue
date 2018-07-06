
<template>
  <div>
    <el-button type="text" @click="show">添加过滤词，用英文逗号分隔</el-button>
    <el-button size="small" @click="refresh">刷新</el-button>
    <el-dialog title="添加过滤词" :visible.sync="dialogInputVisible">
      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="inputFilterWords">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="inputChange">完成</el-button>
      </div>
    </el-dialog>

    <div class="top">
      <el-button>本页共{{currentPageNumber}}条数据，当前显示{{showNumber}}条，已过滤{{filterNumber}}条</el-button>
    </div>
		<el-table :data="filteredList" style="width: 100%"   
    :default-sort="{prop: 'id', order: 'descending'}"
    > 
			<el-table-column type="index" :index="index" label="序号" width="120px">
			</el-table-column>      
			<el-table-column prop="userRemark" label="备注信息">
			</el-table-column>
			<el-table-column prop="licenseTag" label="车牌号">
			</el-table-column>
			<el-table-column prop="locationName" label="车机定位信息">
			</el-table-column>
			<el-table-column prop="onlineTime" label="备注时间">
			</el-table-column>
			<el-table-column prop="userId" label="备注用户ID">
			</el-table-column>                  
			<el-table-column prop="isAccurate" label="定位精准度">
        <template slot-scope="scope">
          <span>{{isAccurate[scope.row.isAccurate]}}</span>  
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page.sync="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="onePageSize" layout="sizes, prev, pager, next" :total="totalNumber">
    </el-pagination>
  </div>
</template>
	 
<script>
export default {
  name: 'list',
  data() {
    return {
      carList: [],
      filteredList: [],
      isAccurate: {
        0: '不精准',
        1: '精准',
        2: '较精准'
      },
      currentPage: 1,
      onePageSize: 100,
      totalNumber: 1,
      dialogInputVisible: false,
      inputFilterWords: '停车,负六',
      usedFilterWords: '停车,负六',
      currentPageNumber: 100,
      showNumber: 100,
      filterNumber: 0,
      index: 1,
      // sorts:''
    };
  },
  methods: {
    show() {
      this.dialogInputVisible = true
      this.inputFilterWords = this.usedFilterWords
    },
    init() {
      const timestamp = new Date().getTime();
      const sign = md5("incar" + timestamp);
      this.$store.dispatch('loadingAction',true);
      this.$http
        .post('/car/findAllCar', {
          timestamp,
          sign,
          page: this.currentPage,
          PageSize: this.onePageSize
        })
        .then(response => {
          // console.log(JSON.stringify(response, null, 4));
          this.$store.dispatch('loadingAction',false);
          this.carList = response.data.carList.list;
          this.totalNumber = response.data.carList.total;
          for (var i = 0; i < this.carList.length; i++) {
            var date = new Date(this.carList[i].onlineTime)
            var Y = date.getFullYear() + '年'
            var M =
              (date.getMonth() + 1 < 10
                ? '0' + (date.getMonth() + 1)
                : date.getMonth() + 1) + '月'
            var D = date.getDate() + '日 '
            var h = date.getHours() + ':'
            var m = date.getMinutes() + ':'
            var s = date.getSeconds()
            this.carList[i].onlineTime = Y + M + D + h + m + s
          }
          // for (var i = 0; i < this.carList.length; i++) {
          //   if ((this.carList[i].isAccurate = 0)) {
          //     this.carList[i].isAccurate = "不精准";
          //   }
          //   else if ((this.carList[i].isAccurate = 1)) {
          //     this.carList[i].isAccurate = "精准";
          //   }
          //   else {
          //     this.carList[i].isAccurate = "较精准";
          //   }
          // }
          this.filter()
        })
        .catch(err => {
          console.log(err);
          this.$store.dispatch('loadingAction',false);
        });
    },
    //刷新
    refresh() {
      this.currentPage = 1
      this.init()
    },
    filter() {
      this.filteredList = []
      this.usedFilterWords = this.inputFilterWords
      var filterWordsList = this.usedFilterWords.split(',')
      var denseFilterWordsList = []

      for (var i = 0; i < filterWordsList.length; i++) {
        if (filterWordsList[i] != '') {
          denseFilterWordsList.push(filterWordsList[i])
        }
      }
      this.currentPageNumber = this.carList.length
      for (var i = 0; i < this.carList.length; i++) {
        var flag = false
        for (var j = 0; j < denseFilterWordsList.length; j++) {
          if (this.carList[i].userRemark == null) {
            this.carList[i].userRemark = ''
          }

          if (
            this.usedFilterWords.indexOf('()') > -1 ||
            this.usedFilterWords.indexOf('（）') > -1
          ) {
            if (
              this.carList[i].userRemark.indexOf(denseFilterWordsList[j]) >
                -1 ||
              (this.carList[i].userRemark.indexOf('(') > -1 &&
                this.carList[i].userRemark.indexOf(')') > -1) ||
              (this.carList[i].userRemark.indexOf('（') > -1 &&
                this.carList[i].userRemark.indexOf('）') > -1)
            ) {
              flag = true
              break
            }
          } else {
            if (
              this.carList[i].userRemark.indexOf(denseFilterWordsList[j]) > -1
            ) {
              flag = true
              break
            }
          }
        }
        if (!flag) {
          this.filteredList.push(this.carList[i]);
        }
      }
      this.showNumber = this.filteredList.length
      this.filterNumber = this.currentPageNumber - this.showNumber
    },
    handleSizeChange(onePageSize) {
      this.onePageSize = onePageSize
      this.currentPage = 1
      this.init()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.init()
    },
    inputChange(inputFilterWords) {
      if (this.inputFilterWords.search(/，/) > -1) {
        alert('请输入英文输入法中的逗号')
      } else {
        this.usedFilterWords = this.inputFilterWords
        localStorage.setItem('usedFilterWords', this.usedFilterWords)
        this.filter()
        this.dialogInputVisible = false
      }
    },
    close() {
      this.inputFilterWords = this.usedFilterWords
      this.dialogInputVisible = false
    }
  },
  created() {
    this.usedFilterWords = localStorage.getItem('usedFilterWords')
      ? localStorage.getItem('usedFilterWords')
      : '停车,车场,负一,负二,负三,负四,负五,负六,负七,B1,B2,B3,B4,B5,B6,B7,b1,b2,b3,b4,b5,b6,b7,地下,层,路,街,店,门口,门前,附近,加油站,号,（）,(),楼'
    this.inputFilterWords = localStorage.getItem('usedFilterWords')
      ? localStorage.getItem('usedFilterWords')
      : '停车,车场,负一,负二,负三,负四,负五,负六,负七,B1,B2,B3,B4,B5,B6,B7,b1,b2,b3,b4,b5,b6,b7,地下,层,路,街,店,门口,门前,附近,加油站,号,（）,(),楼'
    this.init()
    // this.indexMethod(index);
  }
}
</script>

<style>
.top {
  display: inline-block;
  float: right;
}

.item {
  margin: 4px;
}
</style>