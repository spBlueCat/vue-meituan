import Router from 'koa-router';
import axios from './utils/axios';


let router = new Router({prefix:'/geo'});

const sign = '6f781baba3f3e9b38478bd2a7b2d3850';

//获取省份与城市的接口
router.get('/getPosition',async (ctx)=>{
  let { status,data:{ province,city }} = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`);
  if( status === 200){
    ctx.body={
      province,
      city
    }
  }else {
    ctx.body = {
      province: '上海市',
      city: '上海市'
    }
  }
})

//用于获取所有的省份或直辖市
router.get('/province', async (ctx) => {
  let {status, data: {province}}= await axios.get(`http://cp-tools.cn/geo/province?sign=${sign}`);
  ctx.body = {
    province: status === 200
      ? province
      : []
  }
})

//输入对应的id获取对应的省份或直辖市数据
router.get('/province/:id', async (ctx) => {
  let {status, data: {city}} = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

router.get('/city', async (ctx) => {
  let {status, data: {city}} = await axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})

router.get('/hotCity', async (ctx) => {
  let {status, data: {hots}} = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }
})

//菜单数据接口
router.get('/menu', async (ctx) => {
  let {status, data: {menu}} = await axios.get(`http://cp-tools.cn/geo/menu?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      menu
    }
  } else {
    ctx.body = {
      menu: []
    }
  }
})

export default router;
