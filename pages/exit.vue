<template>
  <div class=""/>
</template>

<script>
    export default {
      layout: 'blank',
      // 在用户点击退出时进入退出页面并触发此中间件
      middleware: async (ctx) => {
        let {status,data}=await ctx.$axios.get('/users/exit');
        if(status===200&&data&&data.code===0){
          location.href='/';
        }
      }
    }
</script>

<style scoped>

</style>
