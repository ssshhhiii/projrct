<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
 </el-breadcrumb>
 <el-card>
   <div id="main" style="width: 1000px;height:400px;"></div>
 </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){},
    async mounted(){
       var myChart = echarts.init(document.getElementById('main'));
       const {data:res} = await this.$http.get('reports/type/1')
         if(res.meta.status !==200) {return this.$message.error("获取折线图数据失败")};
        myChart.setOption(res.data);
    },
}
</script>

<style>

</style>