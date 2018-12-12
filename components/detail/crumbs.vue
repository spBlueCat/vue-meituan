<template>
  <div class="m-crumbs">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">{{ city }}美团</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">{{ city }}{{ type }}</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">{{ city }}{{ decodeURIComponent(keyword) }}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    props: {
      keyword: {
        type:String,
        default:''
      },
      type: {
        type:String,
        default:''
      }
    },
    data(){
      return{
        city:''
      }
    },
    mounted(){
      let self = this;
      self.city =  localStorage.getItem('city').replace('市','') || self.$store.state.geo.position.city.replace('市','');
    }
  }
</script>
