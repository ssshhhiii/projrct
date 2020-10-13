<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>参数列表</el-breadcrumb-item>
 </el-breadcrumb>
 <el-card>
   <el-alert :closable="false" show-icon
    title="注意:只允许为第三级分类设置相关参数"
    type="warning"> 
  </el-alert>
  <el-row>
    <el-col>
      <span>选择商品分类：</span>
       <el-cascader 
    v-model="selectKeys"
    :options="cateList"
    :props="{ expandTrigger: 'hover' ,value:'cat_id', label:'cat_name', children:'children'}"
    @change="handleChange"></el-cascader>
    </el-col>
  </el-row>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">  <el-button size="mini" type="primary" @click="isShow2=true">添加参数</el-button>
    <el-table :data="mangTableData" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope"> 
          <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(scope.row,i)">{{item}}</el-tag>
          <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
          </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
       <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only"><el-button size="mini" type="primary" @click="isShow2=true">添加属性</el-button>
    <el-table :data="onlyTableData" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope"> 
          <el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(scope.row,i)">{{item}}</el-tag>
          <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
          </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
       <el-table-column label="静态名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    </el-tab-pane>
  </el-tabs>
 </el-card>
 <el-dialog :title="'添加' +textTitle" :visible.sync="isShow2" width="50%" @close="addRoleClose">
  <el-form ref="addRoleRef" :model="addRoleForm" label-width="80px" :rules="addRoleRules">
  <el-form-item :label="textTitle" prop="attr_name">
    <el-input v-model="addRoleForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer">
    <el-button @click="isShow2 = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
    data(){
      return{
        cateList:[],
        selectKeys:[],
        activeName:"many",
        mangTableData:[],
        onlyTableData:[],
        isShow2:false,
        addRoleForm:{
          attr_name:""
        },
        addRoleRules:{attr_name:[{required: true}] 
        },
      }
    },
    computed:{
      cateId(){
        return this.selectKeys[2]
      },
      textTitle(){
        if(this.activeName === "many"){return "动态参数"}
        {return  "静态属性"}
      }
    },
    created(){
      this.getCateList()
    },
    methods:{
         async getCateList(){
         const {data:res} = await this.$http.get('categories')
         if(res.meta.status !==200) {return this.$message.error("获取商品分类失败")};
        //  console.log(res)
          this.cateList=res.data
         },
        handleChange(){
           this.getParamsDate()
         },
        handleClick(){
          this.getParamsDate()
          // console.log(this.activeName)
         },
        async getParamsDate(){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
           { params:{sel:this.activeName}})
         if(res.meta.status !==200) {return this.$message.error("获取参数列表失败")};
         res.data.forEach(item => {
           item.attr_vals=item.attr_vals? item.attr_vals.split(' '):[]
           item.inputVisible=false
           item.inputValue=""
         });
         console.log(res.data)
            if(this.activeName=="many"){return this.mangTableData=res.data}
            else{ this.onlyTableData=res.data}
         },
         addRoleClose(){
           this.$refs.addRoleRef.resetFields()
         },
         addRole(){
           this.$refs.addRoleRef.validate(async val=>{
                if(!val) return;
                const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,
                {attr_sel:this.activeName,attr_name:this.addRoleForm.attr_name});
                console.log(res)
               if(res.meta.status !== 201) return this.$message.error("添加参数失败");
              this.$message.success("添加参数成功");
              this.isShow2=false
              this.getParamsDate()
            })
         },
         async handleInputConfirm(row){
           if(row.inputValue.trim().length==0)
           {row.inputValue="" ,  row.inputVisible=false 
            return }
        { row.attr_vals.push(row.inputValue.trim())
             row.inputValue="",row.inputVisible=false
              const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                {attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(" "),attr_name:row.attr_name});
                console.log(res)
               if(res.meta.status !== 200) return this.$message.error("修改参数失败");
              this.$message.success("修改参数成功");
        }
         },
         showInput(val){
           val.inputVisible=true
            this.$nextTick(_ => {
             this.$refs.saveTagInput.$refs.input.focus();
            });
         },
         async saveAttr(row){
             const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                {attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(" "),attr_name:row.attr_name});
                console.log(res)
               if(res.meta.status !== 200) return this.$message.error("修改参数失败");
              this.$message.success("修改参数成功");
         },
         handleClose(row,i){
           row.attr_vals.splice(i,1)
           this.saveAttr(row)
         }
    }
}
</script>

<style scoped>
.el-alert{
  margin-bottom: 10px;
}
.el-cascader{
  width: 250px;
}
.el-tag{
  margin-right:15px ;
}
.input-new-tag{
  width: 120px;
}
</style>