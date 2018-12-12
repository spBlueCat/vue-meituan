<template>
  <div class="search-panel">
    <el-row class="m-header-searchbar">
      <el-col
        :span="5"
        class="left">
        <img
          src="//s0.meituan.net/bs/fe-web-meituan/e5eeaef/img/logo.png"
          alt="美团">
      </el-col>
      <el-col
        :span="15"
        class="center">
        <div class="wrapper">
          <el-input
            v-model="search"
            placeholder="搜索商家地址"
            @focus="focus"
            @blur="blur"
            @input="input"/>
          <button class="el-button el-button-primary">
            <i class="el-icon-search"/>
          </button>
          <dl
            v-if="isHotPlace"
            class="hotPlace">
            <dt>热门搜索</dt>
            <dd
              v-for="(item,index) in hotPlace.slice(0,5)"
              :key="index">
              <a
                :href="'/products?keyword='+encodeURIComponent(item.name)"
                @click="localStorage(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
          <dl
            v-if="isSearchList"
            class="searchList">
            <dd
              v-for="(item,index) in searchList"
              :key="index">
              <a
                :href="'/products?keyword='+encodeURIComponent(item.name)"
                @click="localStorage(item.name)">{{ item.name }}</a>
            </dd>
          </dl>
        </div>
        <p class="suggest">
          <a
            v-for="(item,index) in hotPlace"
            :key="index"
            :href="'/products?keyword='+encodeURIComponent(item.name)"
            @click="localStorage(item.name)">{{ item.name }}</a>
        </p>
        <ul class="nav">
          <li>
            <nuxt-link
              to="/"
              class="takeout">美团外卖</nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/"
              class="movie">猫眼电影</nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/"
              class="hotel">美团酒店</nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/"
              class="apartment">名宿/公寓</nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/"
              class="business">商家入驻</nuxt-link>
          </li>
          <li>
            <nuxt-link
              to="/"
              class="gongyi">美团公益</nuxt-link>
          </li>
        </ul>
      </el-col>
      <el-col
        :span="4"
        class="right">
        <ul
          class="security">
          <li><i class="refund"/><p class="txt">随时退</p></li>
          <li><i class="single"/><p class="txt">不满意免单</p></li>
          <li><i class="overdue"/><p class="txt">过期退</p></li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import _ from 'lodash';
    export default {
      data(){
        return{
          search:'', //搜索框的值
          isFocus:false, //判断搜索框是否被点击
          hotPlace:[],
          searchList:[]
        }
      },
      computed:{
        isHotPlace(){
          return this.isFocus&&!this.search
        },
        isSearchList(){
          return this.isFocus&&this.search
        }
      },
      //如果localStorage中有city字段则显示此城市的热门景点,否则就使用用户所在城市的热门景点
      async mounted(){
        if(localStorage.getItem('city')){
          let self = this;
          const {status:status3,data:{result}} = await self.$axios.get('/search/hotplace',{
            params:{
              city: localStorage.getItem('city').replace('市','') ,
            }
          });
          /*self.$store.commit('home/setHotPlace',status3===200?result:[]);*/
          self.hotPlace= status3===200?result:[];
        }else{
          self.hotPlace= self.$store.state.home.hotPlace
        }
      },
      methods:{
        localStorage(keyword){
          localStorage.setItem('keyword',keyword)
        },
        focus(){
          this.isFocus=true
        },
        blur(){
          setTimeout(()=>{
            this.isFocus=false
          },200)
        },
        //用户键入时使用函数防抖来发送请求获取数据
        input:_.debounce(async function(){
          let self=this;
          console.log(localStorage.getItem('city'));
          let city= localStorage.getItem('city').replace('市','') || self.$store.state.geo.position.city.replace('市','');
          self.searchList=[];
          let {status,data:{top}}= await self.$axios.get('/search/top',{
            params:{
              input: self.search,
              city
            }
          });
          if(status===200){
            self.searchList= top.slice(0,10);
          }
        },200)
      }
    }
</script>

<style>
</style>
