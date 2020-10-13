<template>
    <el-container class="home">
      <el-header>
        <div class="logo"><img :src="image"><span>电商后台管理系统</span></div>
         <el-button type="info" @click="logout">退出</el-button></el-header>
      <el-container>
        <!-- 左侧导航栏 -->
        <el-aside :width="isFolded ? '64px' : '200px'">
          <div class="btn" @click="folded">|  |  |</div>
           <el-menu unique-opened background-color="#333744" text-color="#fff" active-text-color="#409eff" :collapse="isFolded"
           :collapse-transition="false" :router="true" :default-active="activePath">
      <el-submenu :index="item.id + '' " v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="icon[item.id]" class="sss"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index=" '/' + items.path " v-for="items in item.children" :key="items.id" @click="highLight('/' + items.path)">
            <template slot="title">
             <i class="el-icon-menu"></i>
             <span>{{items.authName}}</span>
            </template>
          </el-menu-item>     
      </el-submenu>
    </el-menu>
        </el-aside>
        <!-- 主区域 -->
        <el-main><router-view></router-view></el-main>
     </el-container>
   </el-container>
</template>

<script>
export default {
  created(){
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem("activePath")
  }
  ,
  data(){
    return{
      image:require("../assets/87s4.jpg"),
      menulist:[],
      icon:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      isFolded:false,
      activePath:""
    }
  },
  methods:{
    logout(){
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist=res.data
      // console.log(res)
    },
    folded(){
      this.isFolded=!this.isFolded
    },
    highLight(activePath){
      window.sessionStorage.setItem("activePath",activePath)
      this.activePath=activePath
    }
  }
}
</script>
<style scoped>
.home{
  height: 100%;
}
.el-header{
  background: #374d4e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  color: #fff;
  padding-left: 0px;
}
.logo{
  display: flex;
  align-items: center;
}
.logo span{
  margin-left: 15px;
}
.el-header img{
  height: 60px;
}
.el-aside{
  background: #333744;
}
.sss{
  margin-right: 10px;
}
.main{
  background: #eaedfe;
}
.el-menu{
  border-right: none;
}
.btn{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
  text-align: center;
}
</style>
