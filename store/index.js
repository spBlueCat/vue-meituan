import Vue from 'vue';
import Vuex from 'vuex';
import geo from './modules/geo';
import home from './modules/home';

Vue.use(Vuex);

const store =()=>new Vuex.Store({
  modules:{
    geo,
    home
  },
  actions:{
    //使用nuxtServerInit方法将context对象作为第二个参数
    async nuxtServerInit({commit},{req,app}){
      //获取当前所在省份与城市
      const {status, data:{province, city}} = await app.$axios.get('/geo/getPosition');
      //在客户端获取省份与城市信息
        commit('geo/setPosition',status===200?{city,province}:{city:'上海市',province:'上海市'});


      //获取菜单数据
      const {status:status2,data:{menu}} = await app.$axios.get('/geo/menu');
      commit('home/setMenu',status2===200?menu:[]);

      //获取对应城市的热门景点
      const {status:status3,data:{result}} = await app.$axios.get('/search/hotPlace',{
        params:{
          city: app.store.state.geo.position.city.replace('市','')
        }
      });
      commit('home/setHotPlace',status3===200?result:[]);
    }
  }
})

export default store
