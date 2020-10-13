<template>
 <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
 </el-breadcrumb>
 <el-card>
 <el-row>
     <el-col><el-button type="primary" @click="addClassify">添加分类</el-button> </el-col>
 </el-row>
 <tree-table class="tree" show-index border :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" >
     <template slot-scope="scope" slot="isok">
         <i class="el-icon-success err" v-if="scope.row.cat_deleted==false"></i>
         <i class="el-icon-error suc" v-else></i>
     </template>
     <template slot-scope="scope" slot="order">
                 <el-tag v-if="scope.row.cat_level=='0'" size="mini">一级</el-tag>
                 <el-tag type="success" v-else-if="scope.row.cat_level=='1'"  size="mini">二级</el-tag>
                <el-tag type="info" v-else  size="mini">三级</el-tag>
        </template>
        <template slot-scope="" slot="opt">
                 <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
 </tree-table>
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 3, 5, 7]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
 </el-card>
 <el-dialog
  title="添加分类"
  :visible.sync="isShow1"
  width="50%" @close="addClassifyClose" >
 <el-form ref="cateRef" :model="cateForm" label-width="100px" :rules="cateRules">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="cateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类:">
  <el-cascader   class="father" clearable 
    v-model="selectKeys"
    :options="ParentCateList"
    :props="dad"  @change="parentCateChange"></el-cascader>
  </el-form-item>
 </el-form>
  <span slot="footer">
    <el-button @click="isShow1 = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
 </div>
</template>

<script>
export default {
    data(){
        return{
            queryInfo:{
                  type:3,
                  pagenum:1,
                  pagesize:5,
         },
            total:0,
            cateList:[],
            columns:[
                {label:"分类名称",
                prop:"cat_name"},
                 {label:"是否有效",
                type:"template",
                template:"isok"},
                {label:"排序",
                type:"template",
                template:"order"},
                {label:"操作",
                type:"template",
                template:"opt"}
                ],
                isShow1:false,
                cateForm:{
                    cat_name:"",
                    cat_pid:0,
                    cat_level:0
                },
                cateRules:{cat_name:[{ required: true}]},
                ParentCateList:[],
                selectKeys:[],
                dad:{value:'cat_id',
                    label:'cat_name',
                    children:'children',
                    checkStrictly:true
                    }
        }
    },
    created()
    {
       this.getCateList()
    },
    methods:{
       async getCateList(){
         const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
         if(res.meta.status !==200) {return this.$message.error("获取商品分类失败")};
        //  console.log(res)
          this.cateList=res.data.result
          this.total=res.data.total
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getCateList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage
            this.getCateList()
        },
        addClassify(){
            this.getParentCateList()
            this.isShow1=true
        },
        async getParentCateList(){
         const {data:res} = await this.$http.get('categories',{params:{type:2}})
         if(res.meta.status !==200) {return this.$message.error("获取商品分类失败")};
         this.ParentCateList=res.data
         console.log(res.data)
        },
        parentCateChange(){
            if(this.selectKeys.length>0){
                this.cateForm.cat_pid=this.selectKeys[this.selectKeys.length-1]
                this.cateForm.cat_level=this.selectKeys.length
                return
            }
            else this.cateForm.cat_level=0
            this.cateForm.cat_pid=0
        },
        addCate(){
            this.$refs.cateRef.validate(async val=>{
         if(!val) return
         const {data:res}=await this.$http.post('categories',this.cateForm);
        //  console.log(res)
               if(res.meta.status !== 201)  {this.$message.error("添加分类失败")} 
              this.$message.success("添加分类成功")
              this.isShow1 = false
              this.getCateList()
       })
           
        },
        addClassifyClose(){
            this.$refs.cateRef.resetFields()
            this.selectKeys=[]
            this.cateForm.cat_pid=0
            this.cateForm.cat_level=0
        }
    }
}
</script>

<style scoped>
.err{
    color: lightgreen;
}
.suc{
    color: red;
}
.tree{
    margin-top: 15px;
}
.father{
    width: 100%;
}
</style>