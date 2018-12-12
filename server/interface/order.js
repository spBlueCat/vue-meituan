import Router from 'koa-router';
import Cart from '../dbs/models/cart'
import Order from '../dbs/models/order'
import md5 from 'crypto-js/md5'

let router = new Router({prefix: '/order'});

//创建订单
router.post('/createOrder', async ctx => {
  let {id, price, count} = ctx.request.body;
  let time = Date();
  let orderID = md5(Math.random() * 1000 + time).toString();
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      msg: 'please login'
    }
  } else {
    let findCart = await Cart.findOne({cartNo: id});
    let order = new Order({
      id: orderID,   //订单编号
      count,   //商品数量
      total: price * count,  //总金额
      time,   //下单时间
      user: ctx.session.passport.user,  //存在session中的用户数据
      name: findCart.detail[0].name,
      imgs: findCart.detail[0].imgs,
      status: 0
    });
    try {
      let result = await order.save();
      // 如果订单成功存入order表中则将购物车数据从cart表中移除
      if (result) {
        await findCart.remove();
        ctx.body = {
          code: 0,
          id: orderID
        }
      } else {
        ctx.body = {
          code: -1
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1
      }
    }
  }
});

//获取订单信息
router.post('/getOrders', async ctx => {
  //判断用户是否登录
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: -1,
      list: [],
      msg: 'please login'
    }
  } else {
    try {
      let result = await Order.find();
      if (result) {
        ctx.body = {
          code: 0,
          list: result
        }
      } else {
        ctx.body = {
          code: -1,
          list: []
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        list: []
      }
    }
  }
})

export default router
