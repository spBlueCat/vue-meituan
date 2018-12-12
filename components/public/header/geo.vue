<template>
  <div class="m-geo">
    <i class="el-icon-location"/>{{ city.replace('市','') }}
    <nuxt-link
      class="changeCity"
      to="/changeCity">切换城市</nuxt-link>
  </div>
</template>

<script>
    export default {
      data(){
        return{
          city:''
        }
      },
      mounted(){
        let self = this;
        self.city = localStorage.getItem('city') || self.$store.state.geo.position.city;
      }
    }
</script>

<style>

</style>
