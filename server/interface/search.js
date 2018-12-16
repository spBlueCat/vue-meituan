import Router from 'koa-router';
import axios from './utils/axios'


let router = new Router({prefix:'/search'});

const sign = '******;

//根据用户输入搜索框的内容返回数据
/**
 * @param input 用户输入搜索框的内容
 * @param city 城市名
 */
router.get('/top',async (ctx)=>{
  let {status, data:{top}} = await axios.get(`http://cp-tools.cn/search/top`,{
    params:{
      input: ctx.query.input,
      city: ctx.query.city,
      sign
    },
  });
  ctx.body={
    top: status===200 ? top : []
  }
});

// 根据收到的city来返回此城市的热门景点
router.get('/hotplace',async (ctx)=>{
  let city= ctx.store ? ctx.store.geo.position.city : ctx.query.city;
  let {status,data:{result}} = await axios.get(`http://cp-tools.cn/search/hotplace`,{
    params:{
      sign,
      city
    }
  });
    ctx.body = {
      result: status===200 ? result : []
  }
});

//根据city和keyword搜索并返回景点数据
/**
 * @param city 城市名称
 * @param keyword 景点名
 */
router.get('/resultsByKeywords',async (ctx)=>{
  const {city,keyword} = ctx.query;
  let {status,data:{count,pois}} = await axios.get(`http://cp-tools.cn/search/resultsByKeywords`,{
    params:{
      city,
      keyword,
      sign
    }
  });
  ctx.body = {
    count: status===200 ? count : 0,
    pois: status===200 ? pois : []
  }
});

//获取产品数据
/**
 * @param city 城市名称
 * @param keyword 景点名
 */
router.get('/products', async (ctx) => {
  let keyword = ctx.query.keyword || '旅游';
  let city = ctx.query.city || '北京';
  let {status, data:{product, more}} = await axios.get('http://cp-tools.cn/search/products', {
    params: {
      keyword,
      city,
      sign
    }
  });
  if (status === 200) {
    ctx.body = {
      product,
      more: ctx.isAuthenticated() ? more : [], //根据用户的登录状态来返回不同的数据
      login: ctx.isAuthenticated()
    }
  }else{
    ctx.body = {
      product: {},
      more: ctx.isAuthenticated() ? more : [],
      login: ctx.isAuthenticated()
    }
  }
});

export default router;
