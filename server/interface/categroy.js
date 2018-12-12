import Router from 'koa-router';
import axios from './utils/axios'

let router = new Router({prefix: '/categroy'});

const sign = '6f781baba3f3e9b38478bd2a7b2d3850';


/**
 * @param city 城市名称  默认为北京
 */
router.get('/crumbs',async (ctx)=>{
  let {status,data:{areas,types}} = await axios.get('http://cp-tools.cn/categroy/crumbs',{
    params:{
      city:ctx.query.city.replace('市','') || "北京",
      sign
    }
  });
  ctx.body={
    areas: status===200?areas:[],
    types: status===200?types:[]
  }
})


export default router;
