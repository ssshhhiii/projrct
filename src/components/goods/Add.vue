<template>
  <div>
       <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
 </el-breadcrumb>
 <el-card>
     <el-alert
    title="添加商品信息"
    type="info" show-icon center :closable="false">
  </el-alert>
  <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
  </el-steps>
 <el-form ref="addformRef" :model="addForm" label-width="80px" :rules="addRules" label-position="top">
 <el-tabs :tab-position="'left'"  v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClick">
    <el-tab-pane label="基本信息" name="0">
         <el-form-item label="商品名称" prop="goods_name">
         <el-input v-model="addForm.goods_name"></el-input>
         </el-form-item>
         <el-form-item label="商品价格" prop="goods_price">
         <el-input v-model="addForm.goods_price"></el-input>
         </el-form-item>
         <el-form-item label="商品重量" prop="goods_weight">
         <el-input v-model="addForm.goods_weight"></el-input>
         </el-form-item>
         <el-form-item label="商品数量" prop="goods_weight">
         <el-input v-model="addForm.goods_nnmber"></el-input>
         </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
               <el-cascader 
    v-model="addForm.goods_cat"
    :options="cateList"
    :props="{ expandTrigger: 'hover' ,value:'cat_id', label:'cat_name', children:'children'}"
    @change="handChange"></el-cascader>
         </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数">
        <el-form-item :label="item.attr_name" v-for="item in manyDate" :key="item.attr_id">
             <el-checkbox-group v-model="item.attr_vals">
                   <el-checkbox :label="items" v-for="(items,i) in item.attr_vals" :key="i" border></el-checkbox>
             </el-checkbox-group>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性">
        <el-form-item :label="item.attr_name" v-for="item in onlyDate" :key="item.attr_id">
             <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
    </el-tab-pane>
     <el-tab-pane label="商品图片">
         <el-upload
  action="http://127.0.0.1:8888/api/private/v1/upload"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  list-type="picture" :headers="headerObj" :on-success="handSuccess">
  <el-button size="small" type="primary">点击上传</el-button>
 </el-upload>
     </el-tab-pane>
     <el-tab-pane label="商品内容">
         <quill-editor v-model="addForm.goods_introduce"></quill-editor>
         <el-button type="primary" @click="add">添加商品</el-button>
     </el-tab-pane>
  </el-tabs>
 </el-form>
 </el-card>
 <el-dialog
  title="图片预览"
  :visible.sync="isShow3"
  width="50%">
 <img :src="preview" class="dad">
</el-dialog>
  </div>

</template>
<script>
import _ from 'lodash'
export default {
    data(){
        return{
            activeIndex:'0',
            addForm:{
                goods_name:"",
                goods_price:0,
                goods_weight:0,
                goods_nnmber:0,
                goods_cat:[],
                pics:[],
                goods_introduce:"",
                attrs:[]
            },
            addRules:{
                goods_name:[{required:true}],
                goods_price:[{required:true}],
                goods_weight:[{required:true}],
                goods_nnmber:[{required:true}],
                goods_cat:[{required:true}]
            },
            cateList:[],
            selectKeys:[],
            manyDate:[],
            onlyDate:[],
            headerObj:{
                Authorization:window.sessionStorage.getItem("token")
            },
            preview:"",
            isShow3:false,
           
        }
    },
     created(){
        this.getCateList()
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length==3){return this.addForm.goods_cat[2]}
        }
    },
    methods:{
        async getCateList(){
                const {data:res} = await this.$http.get('categories')
         if(res.meta.status !==200) {return this.$message.error("获取参数列表失败")}
            this.cateList=res.data
            // console.log(res)
        },
        handChange(){
            console.log(this.addForm.goods_cat)
        },
        beforeTabLeave(activeName, oldActiveName){
            if(oldActiveName==0 && this.addForm.goods_cat.length!==3){
                this.$message.error("请选择商品分类名称")
                return false}
        },
        async tabClick(){
            if(this.activeIndex=='1'){
               const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:"many"}})
               if(res.meta.status !==200) {return this.$message.error("获取参数失败")}
               res.data.forEach(item=>{
                   item.attr_vals= item.attr_vals.length==0? []:item.attr_vals.split(' ')
               })
               this.manyDate=res.data
        //   console.log(res)
            }
           else if(this.activeIndex=='2'){
               const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:"only"}})
               if(res.meta.status !==200) {return this.$message.error("获取参数失败")}
               this.onlyDate=res.data
          console.log(res)
            }
        },
        handlePreview(file){
            console.log(file)
            this.preview=file.response.data.url
            this.isShow3=true
        },
        handleRemove(file){
            const filePath=file.response.data.tmp_path
            const i=this.addForm.pics.findIndex(x => x.pic==filePath)
            this.addForm.pics.splice(i,1)
            // console.log(this.addForm)
        },
        handSuccess(response){
            const picInfo={pic:response.data.tmp_path}
            this.addForm.pics.push(picInfo)
            // console.log(this.addForm)
        },
        add(){
            this.$refs.addformRef.validate(async vail=>{
                if(!vail){return this.$message.error("填写必要项")}
                 const form = _.cloneDeep(this.addForm)
                form.goods_cat=form.goods_cat.join(",")
                 this.manyDate.forEach(item=>{
               const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
               this.addForm.attrs.push(newInfo)
               })
            this.onlyDate.forEach(item=>{
               const newInfo={attr_id:item.attr_id,attr_value:item.attr_vals}
               this.addForm.attrs.push(newInfo)
                })
               form.attrs = this.addForm.attrs
             const {data:res} =await this.$http.post('goods',form)
             console.log(res)
               if(res.meta.status !==201) {return this.$message.error("添加商品失败")}
               this.$message.success("添加商品成功")
               this.$router.push('/goods')
           console.log(form)
         })         
        }
    }
}
</script>
 
<style scope>
.el-checkbox{
    margin:0 10px 0 0!important;
}
.dad{
    width: 100%;
}
</style>