<template>
  <div class="m-crumbs">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">{{ city }}美团</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">{{ city }}{{ decodeURIComponent(keyword) }}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    props: {
      keyword: {
        type: String,
        default: ''
      }
    },
    data(){
      return{
        city:''
      }
    },
    mounted(){
      let self = this;
      self.$store.dispatch('geo/setPosition',{
        city:localStorage.getItem('city'),
        province:''
      });
      self.city = localStorage.getItem('city') || self.$store.state.geo.position.city.replace('市','');
    }
  }
</script>
