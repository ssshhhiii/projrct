<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
 </el-breadcrumb>
 <el-card >
   <el-row :gutter="20">
     <el-col :span="7"><el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
  </el-input></el-col>
  <el-col :span="4"><el-button type="primary" @click="dialogVisible=true">添加用户</el-button></el-col>
   </el-row>
   <el-table :data="userList" border>
     <el-table-column type="index"></el-table-column>
     <el-table-column label="姓名" prop="username"></el-table-column>
     <el-table-column label="邮箱" prop="email"></el-table-column>
     <el-table-column label="电话" prop="mobile"></el-table-column>
     <el-table-column label="角色" prop="role_name"></el-table-column>
     <el-table-column label="状态" >
       <template slot-scope="scope">
         <el-switch  v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
         </el-switch>
       </template>
     </el-table-column>
     <el-table-column label="操作" width="180px">
       <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeUserMessage(scope.row.id)"></el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
         <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="assignRoles(scope.row)"></el-button>
          </el-tooltip>
       </template>
     </el-table-column>
   </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4,5,6,7]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

<el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="50%" @close="FormClose">

  <el-form :model="ruleForm"  ref="Ref" :rules="rules" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="ruleForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password" >
    <el-input v-model="ruleForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="ruleForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="mobile">
    <el-input v-model="ruleForm.mobile"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>


<el-dialog
  title="修改"
  :visible.sync="abcd"
  width="50%" @close="changeClose" >
<el-form ref="changeRef" :model="usermessage" label-width="80px" :rules="changeRules">
  <el-form-item label="用户名">
    <el-input v-model="usermessage.username"  disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="usermessage.email" ></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="usermessage.mobile" ></el-input>
  </el-form-item>
</el-form>
  <span slot="footer">
    <el-button @click="abcd = false">取 消</el-button>
    <el-button type="primary" @click="userChangeMessage">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="分配角色"
  :visible.sync="isShow"
  width="50%" @close="setClose">
 <p>当前的用户：{{userInfo.username}}</p>
 <p>当前的角色：{{userInfo.role_name}}</p>
 <p>分配新角色:
    <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in rolrsList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
 </p>
  <span slot="footer" >
    <el-button @click="isShow=false">取 消</el-button>
    <el-button type="primary" @click="saveInfo">确 定</el-button>
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
        pagesize:2
      },
      userList:[],
      total:0,
      dialogVisible:false,
      ruleForm:{
        username:"",
        password:"",
        email:"",
        mobile:""
      },
      rules:{
        username:[{ required: true, message: '请输入用户名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password:[{ required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' }],                     
      },
      abcd:false,
      usermessage:{
       
      },
      changeRules:{
        mobile:[],
        email:[]
      },
      isShow:false,
      userInfo:{},
      rolrsList:[],
      value:""
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList() {
     const {data:res} = await this.$http.get('users',{params:this.queryInfo})
        if(res.meta.status !==200) {return this.$message.error("获取失败")};
          this.userList=res.data.users
          this.total=res.data.total
    //  console.log(res)
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getUserList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getUserList()
    },
    async userStateChange(val){
    const {data:res} = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      if(res.meta.status !==200) {return  val.mg_state=!val.mg_state
      this.$message.error("更新状态失败")}
      this.$message.success("更新状态成功")
      // console.log(val.mg_state)
    },
    FormClose(){
      this.$refs.Ref.resetFields()
    },
    addUser(){
       this.$refs.Ref.validate(async val=>{
         if(!val) return
         const {data:res}=await this.$http.post( "users",this.ruleForm);
        //  console.log(res)
               if(res.meta.status !== 201)  {this.$message.error("添加用户失败")} 
              this.$message.success("添加用户成功")
              this.dialogVisible = false
              this.getUserList()
       })
    },
    async changeUserMessage(id){
     const {data:res} = await this.$http.get('users/' + id)
     if(res.meta.status !== 200)  {this.$message.error("查询用户信息失败")} 
    //  console.log(res)
      this.usermessage=res.data
      this.abcd=true
    },
    changeClose(){
      this.$refs.changeRef.resetFields()
    },
    userChangeMessage(){
       this.$refs.changeRef.validate(async val=>{
         if(!val) return
         const {data:res}=await this.$http.put( 'users/'+ this.usermessage.id,{email:this.usermessage.email,mobile:this.usermessage.mobile});
         console.log(res)
               if(res.meta.status !== 200)  {this.$message.error("更新用户信息失败")} 
              this.$message.success("更新用户信息成功")
              this.abcd = false
              this.getUserList()
       })
    },
    async removeUser(id){
      const result=await  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch(err=>err)
        if(result=='cancel'){return this.$message.info('已取消删除')}
         const {data:res} = await this.$http.delete('users/' + id)
          if(res.meta.status !== 200)  {this.$message.error("删除用户失败")} 
          this.$message.success("删除用户成功")
          this.getUserList()
    },
    async assignRoles(userinfo){
      this.userInfo=userinfo
      const {data:res} = await this.$http.get('roles')
      console.log(res)
        if(res.meta.status !==200) {return this.$message.error("获取角色列表失败")};
          this.rolrsList=res.data
      this.isShow=true
    },
    async saveInfo(){
      if(!this.value){return this.$message.error("请选择要分配的角色")}
       const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.value})
       console.log(res)
        if(res.meta.status !==200) {return this.$message.error("更新角色失败")};
        this.$message.success("更新角色成功")
        this.getUserList()
      this.isShow=false
    },
    setClose(){
      this.value=""
      this.userInfo=[]
    }
  }
}
</script>

<style>

</style>