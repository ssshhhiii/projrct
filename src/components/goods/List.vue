<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
 </el-breadcrumb>
 <el-card >
   <el-row :gutter="20">
     <el-col :span="7"><el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
  </el-input></el-col>
  <el-col :span="4"><el-button type="primary" @click="goAddPage">添加商品</el-button></el-col>
   </el-row>
    <el-table :data="goodList" border stripe>
     <el-table-column type="index"></el-table-column>
     <el-table-column label="商品名称" prop="goods_name"></el-table-column>
     <el-table-column label="商品价格" prop="goods_price" width="90px"></el-table-column>
     <el-table-column label="商品重量" prop="goods_weight" width="90px" ></el-table-column>
     <el-table-column label="创建时间" prop="add_time" width="170px">
         <template slot-scope="scope">{{scope.row.add_time | getDate}}</template>
     </el-table-column>
     <el-table-column label="操作" width="130px">
       <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)"></el-button>
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
           goodList:[],
           total:0
        }
    },
    created(){
      this.getGoodsList()
    },
    methods:{
        async getGoodsList(){
             const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
        if(res.meta.status !==200) {return this.$message.error("获取商品列表失败")}
         this.$message.success("获取商品列表成功")
          this.total=res.data.total
          this.goodList=res.data.goods
         console.log(res)
        },
         handleSizeChange(newSize){
                  this.queryInfo.pagesize=newSize
                  this.getGoodsList()
          },
         handleCurrentChange(newPage){
         this.queryInfo.pagenum=newPage
         this.getGoodsList()
         },
         async removeGoods(id){
          const result=await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch(err=>err)
        if(result=='cancel'){return this.$message.info('已取消删除')}
         const {data:res} = await this.$http.delete(`goods/${id}`)
          if(res.meta.status !== 200)  {this.$message.error("删除商品信息失败")} 
          this.$message.success("删除商品信息成功")
          this.getGoodsList()
         },
         goAddPage(){
             this.$router.push("/goods/add")
        }
    }
}
</script>

<style scope>

</style>