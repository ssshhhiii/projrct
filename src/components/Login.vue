<template>
  <div class="login">
    <div class="box">
        <!-- 头像区域 -->
      <div class="pic">
        <img src="../assets/logo.png" />
      </div>
      <!-- 表单区域 -->
      <el-form :model="loginFrom" :rules="rules" ref="Ref"  label-width="0px" class="from">
        <el-form-item  prop="username" >
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
           <el-button type="primary" @click="login">登入</el-button>
           <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            loginFrom:{
                username:"admin",
                password:"123456",
            },
            rules:{
                username:[{ required: true, message: '请输入登入名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
                password:[{ required: true, message: '请输入登入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
            }
        }
    },
    methods:{
        reset(){
            this.$refs.Ref.resetFields()
        },
        login(){
            this.$refs.Ref.validate(async val=>{
                if(!val) return;
                const {data:res}=await this.$http.post( "login",this.loginFrom);
               if(res.meta.status !== 200) return this.$message.error("登入失败");
              this.$message.success("登入成功");
              window.sessionStorage.setItem('token' ,res.data.token);
              this.$router.push("/home")
            })
        }
    }
};
</script>

<style  scoped>
.login {
  background: #2b4b6b;
  height: 100%;
}
.login .box {
  width: 450px;
  height: 300px;
  background: #ffffff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.pic {
  width: 130px;
  height: 130px;
  border: 1px solid #eeeeee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #dddddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
}
.pic img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eeeeee;
}
.from{
    width: 100%;
    position: absolute;
    bottom: 0px;
    padding: 0 20px;
    box-sizing: border-box;
}
.btn{
    display: flex;
    justify-content: flex-end;
}
</style>