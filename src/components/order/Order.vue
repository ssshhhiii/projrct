<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
 </el-breadcrumb>
 <el-card >
   <el-row :gutter="20">
     <el-col :span="7"><el-input placeholder="请输入内容">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input></el-col>
  <el-col :span="4"><el-button type="primary" >添加商品</el-button></el-col>
   </el-row>
<el-table :data="orderList" border stripe>
     <el-table-column type="index"></el-table-column>
     <el-table-column label="订单编号" prop="order_number"></el-table-column>
     <el-table-column label="订单价格" prop="order_price" width="120px" ></el-table-column>
     <el-table-column label="是否付款" prop="pay_status"  width="160px">
         <template slot-scope="scope">
             <el-tag v-if="scope.row.pay_statue == '1'" type="success">已付款</el-tag>
              <el-tag v-else type="danger">未付款</el-tag>
         </template>
     </el-table-column>
     <el-table-column label="是否发货" prop="is_send" width="120px"></el-table-column>
     <el-table-column label="下单时间" prop="create_time">
         <template slot-scope="scope">{{scope.row.create_time | getDate}}</template>
     </el-table-column>
     <el-table-column label="操作" >
         <template slot-scope="">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeAddress"></el-button>
         <el-button  icon="el-icon-location" type="success" size="mini"></el-button>
       </template>
     </el-table-column>
 </el-table>
 <el-pagination
        background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4,5,6,7,10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
 </el-card>
 <el-dialog
  title="修改地址"
  :visible.sync="isShow"
  width="50%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer">
    <el-button @click="isShow = false">取 消</el-button>
    <el-button type="primary" @click="isShow = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
             queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10,
           },
           total:0,
           orderList:[],
           isShow:false
        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
        async getOrderList(){
             const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
        if(res.meta.status !==200) {return this.$message.error("获取订单列表失败")}
         this.$message.success("获取订单列表成功")
         console.log(res)
          this.total=res.data.total
          this.orderList=res.data.goods
        },
        handleSizeChange(newSize){
                  this.queryInfo.pagesize=newSize
                  this. getOrderList()
          },
         handleCurrentChange(newPage){
         this.queryInfo.pagenum=newPage
         this. getOrderList()
         },
         changeAddress(){
             this.isShow=true
         }
    }
}
</script>

<style>

</style>