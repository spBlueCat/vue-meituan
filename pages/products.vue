<template>
  <el-row class="page-product">
    <el-col :span="19">
      <crumbs :keyword="keyword"/>
      <categroy
        :types="types"
        :areas="areas"/>
      <list :keyword="keyword"/>
    </el-col>
    <el-col :span="5" />
  </el-row>
</template>

<script>
  import Crumbs from '@/components/products/crumbs';
  import Categroy from '@/components/products/categroy';
  import List from '@/components/products/list';
  export default {
    components:{
      Crumbs,
      Categroy,
      List,
    },
    data(){
      return {
        types:[],
        areas:[],
        keyword:'', //景点名
      }
    },
    async asyncData(ctx){
      let keyword = ctx.query.keyword;
      let city = ctx.store.state.geo.position.city;
      let {status,data:{count}} = await ctx.$axios.get('/search/resultsByKeywords',{
        params:{
          keyword,
          city
        }
      });
      let {status:status2,data:{areas,types}} = await ctx.$axios.get('/categroy/crumbs',{
        params:{
          city
        }
      });
      if(status===200&&count>0&&status2===200){
        return {
          keyword,
          areas: areas.filter(item=>item.type!=='').slice(0,5),
          types: types.filter(item=>item.type!=='').slice(0,5),
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/products/index.scss";
</style>
