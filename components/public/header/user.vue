<template>
  <div class="m-user">
    <template v-if="user">
      欢迎您，<span class="username">{{ user }}</span>
      [<nuxt-link to="/exit">退出</nuxt-link>]
    </template>
    <template v-else>
      <nuxt-link
        to="/login"
        class="login">立即登录</nuxt-link>
      <nuxt-link
        class="register"
        to="/register">注册</nuxt-link>
    </template>
  </div>
</template>

<script>
    export default {
      data(){
          return{
            user:""
          }
      },
      async mounted(){
        //从接口获取对应http状态码与用户数据
        const {status,data:{user}} = await this.$axios.get('/users/getUser');
        if(status===200){
          this.user=user;
        }
      }
    }
</script>

<style scoped>

</style>
