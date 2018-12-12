<template>
  <div>
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl
      v-for="item in block"
      :key="item.title"
      class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <span
          v-for="c in item.city"
          :key="c"
          @click="changeCity(c)">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
  import pyjs from 'js-pinyin'
  export default {
    data(){
      return {
        list:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        block:[]
      }
    },
    async mounted(){
      let self=this;
      let blocks=[];
      let {status,data:{city}}=await self.$axios.get('/geo/city');
      if(status===200){
        let p; //用于临时保存对应城市小写拼音的首字母
        let c; //用于临时保存对应城市拼音的小写首字母的Unicode码
        let d={}; //用于保存所有城市小写拼音首字母数组的对象
        //通过js-pinyin库进行首字母匹配
        city.forEach(item=>{
          //截取所有城市小写拼音的首字母
          p=pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1);
          c=p.charCodeAt(0);
          //判断城市拼音首字母是否为小写字母
          if(c>96&&c<123){
            //如果对象中没有此数组,则创建一个对象
            if(!d[p]){
              d[p]=[]
            }
            //将城市名push到对象中对应首字母的数组中
            d[p].push(item.name);
          }
        });
        //将d对象的属性以键值对的方式push进blocks数组中，并进行排序
        for(let [k,v] of Object.entries(d)){
          blocks.push({
            title:k.toUpperCase(),
            city:v
          })
        }
        blocks.sort((a,b)=>a.title.charCodeAt(0)-b.title.charCodeAt(0));
        self.block=blocks
      }
    },
    methods:{
      changeCity(city){
        let self = this;
        self.$store.dispatch('geo/setPosition',{
          city:city.value,
          province:''
        });
        localStorage.setItem('city', city.replace('市',''));
        location.href='/';
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/categroy.scss";
</style>
