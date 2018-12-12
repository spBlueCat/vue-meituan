<template>
  <div class="m-products-list">
    <dl>
      <dd
        v-for="item in nav"
        :key="item.name"
        :class="[item.name,item.acitve?'s-nav-active':'']"
      >{{ item.txt }}</dd>
    </dl>
    <ul>
      <Product
        v-for="(item,idx) in list"
        :key="idx"
        :meta="item"/>
    </ul>
  </div>
</template>

<script>
  import Product from './product.vue'
  export default {
    components: {
      Product
    },
    props: {
      keyword: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        list:[],
        nav: [
          {
            name: 's-default',
            txt: '智能排序',
            acitve: true
          }, {
            name: 's-price',
            txt: '价格最低',
            active: false
          }, {
            name: 's-visit',
            txt: '人气最高',
            active: false
          }, {
            name: 's-comment',
            txt: '评价最高',
            active: false
          }
        ]
      }
    },
    async asyncData({app}) {
      let { data } = await app.$axios.get('searchList');
      return { items: data.list }
    },
    async mounted(){
      let self = this;
      let nkeyword = localStorage.getItem('keyword') || self.keyword;
      console.log(nkeyword);
      let city = localStorage.getItem('city').replace('市','') || self.$store.state.geo.position.city.replace('市','');
      console.log(city);
      let {status,data:{count,pois}} = await self.$axios.get('/search/resultsByKeywords',{
        params:{
          keyword : nkeyword,
          city
        }
      });
      if(status===200&&count>0){
          //过滤掉没有图片的数据
          self.list = pois.filter(item=>item.photos.length).map(item=>{
            return {
              type: item.type,
              img: item.photos[0].url,
              name: item.name,
              comment: Math.floor(Math.random()*10000),
              rate: Number(item.biz_ext.rating),
              price: Number(item.biz_ext.cost),
              scene: item.tag,
              tel: item.tel,
              status: '可订明日',
              location: item.location,
              module: item.type.split(';')[0]
            }
          })
      }
    }
  }
</script>
