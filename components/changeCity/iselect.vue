<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select
      v-model="pvalue"
      placeholder="省份">
      <el-option
        v-for="item in province"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市"
      @change="changeCity">
      <el-option
        v-for="item in city"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <!--
   用户键入时触发querySearchAsync事件
   点击下拉菜单时触发handleSelect事件
   -->
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      @select="handleSelect"/>
  </div>
</template>

<script>
  import _ from 'lodash';
  export default {
    data(){
      return {
        province:[],
        pvalue:'',
        city:[],
        cvalue:'',
        input:'',
        cities:[]
      }
    },
    watch:{
      //通过监测省份来获取城市信息
     async  pvalue(newPvalue){
        let self=this;
        let {status,data:{city}}=await self.$axios.get(`/geo/province/${newPvalue}`);
        if(status===200){
          self.city=city.map(item=>{
            return {
              value:item.id,
              label:item.name
            }
          });
          self.cvalue='';
        }
      }
    },
    async mounted(){
      let self=this;
      let {status,data:{province}}=await self.$axios.get('/geo/province');
      if(status===200){
        self.province=province.map(item=>{
          return {
            value:item.id,
            label:item.name
          }
        })
      }
    },
    methods:{
      //在城市列表选择城市后切换城市并跳转回首页
      changeCity(){
        let self = this;
        let ncity = self.city.find(item=>{return item.value===self.cvalue});
        let nprovince = self.province.find(item=>{return item.value===self.pvalue});
        self.$store.dispatch('geo/setPosition',{
          city:ncity.label==='市辖区'? nprovince.label:ncity.label,
          province:''
        });
        localStorage.setItem('city', (ncity.label==='市辖区'? nprovince.label:ncity.label).replace('市',''));
        location.href='/';
      },
      querySearchAsync:_.debounce(async function(queryString,cb){
        let self=this;
        if(self.cities.length){
          //根据用户输入的内容对列表内的城市信息进行过滤
          cb(self.cities.filter((item)=>item.value.indexOf(queryString)>-1))
        }else{
          //如果用户没有输入内容,则在列表内显示所有城市
          let {status,data:{city}}=await self.$axios.get('/geo/city');
          if(status===200){
            self.cities=city.map((item)=>{return {
              value:item.name
            }});
            cb(self.cities.filter(item => item.value.indexOf(queryString)>-1))
          }else{
            cb([])
          }
        }
      },200),
      // 选中下拉框的城市后切换对应城市并跳转回首页
      handleSelect(item){
        let self = this;
        self.$store.dispatch('geo/setPosition',{
          city:item.value,
          province:''
        });
        localStorage.setItem('city', item.value.replace('市',''));
        location.href='/';
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/iselect.scss";
</style>
