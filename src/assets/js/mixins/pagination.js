// 分页mixins

export default {
    data(){
        return{
            page: 1,//当前也
            limit:10,//每页条数
            pagesizes:[20, 50, 100],//条数数组
            total:0,//总数
            tableData: [],//列表数据
        }
    },
    mounted() {
        this.pageDataReq();
    },
    methods:{
        handleSizeChange(val) {
            this.limit=val;
            this.page=1;
            this.pageDataReq();
        },
        handleCurrentChange(val) {
            this.page=val;
            this.filterForm.page = val;
            this.pageDataReq();
        },
        pageDataReq() {
            this.$store.dispatch('loadingAction',true);
            this.$http.post(this.reqUrl,this.filterForm,).then((response) => {
                this.$store.dispatch('loadingAction',false);
                var res = response.data;
                if (res.code === 200) {
                    this.tableData = res.data.data;
                    this.total=parseInt(res.data.total);
                }else {
                    this.tableData=[];
                    this.page=1;
                }
            }).catch(err => {
                console.log(err);
                this.$store.dispatch('loadingAction',false);
            })
        }
    }
}
