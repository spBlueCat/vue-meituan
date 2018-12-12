import Router from 'koa-router';
import Redis from 'koa-redis';
import nodeMailer from 'nodemailer';
import User from '../dbs/models/users';
import Passport from './utils/passport';
import Email from '../dbs/config';
import axios from './utils/axios';

//设置路由前缀
let router = new Router({
  prefix:'/users'
});

//获取redis客户端
let Store = new Redis().client;

//注册接口
router.post('/signup',async (ctx)=>{
  //判断注册的状态码  0为注册过程 -1为注册失败 1为注册异常
  const {username, password, email, code} = ctx.request.body;
  if(code){
    //当nodemail发送验证码时会将验证码存储于redis中
    //svaeCode： 使用hget获取redis中存储的的对应用户的验证码
    //saveExpire: 从redis获取的验证码失效日期
    const saveCode = await Store.hget(`nodemail:${username}`, 'code');
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire');
    // 判断用户输入的验证码是否与redis中验证码一致
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }


  let user = await User.find({username});
  //判断用户名是否已经存在
  if(user.length){
    ctx.body={
      code: -1,
      msg: '已被注册'
    }
    return
  }
  //如果用户名不存在则将用户数据写人mongodb数据库中
  let nuser = await User.create({username, password, email});
  //判断用户数据是否写入mongodb中
  if(nuser){
    //如果用户数据成功写入,向登录接口发送用户名与密码
    let res = await axios.post('/users/signin',{
      username,
      password
    })
    if(res.data&&res.data.code===0){
      ctx.body={
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    }else{
      ctx.body={
        code: -1,
        msg: 'error'
      }
    }
  }else{
    ctx.body={
      code:-1,
      msg:'注册失败'
    }
  }
});

//登录接口
router.post('/signin',async (ctx,next)=>{
  // 调用local策略来进行登录验证
  /**
   * @param err  用户登录错误
   * @param user 用户信息
   * @param info 登录异常后返回的信息
   * @param status
   */
    return Passport.authenticate('local',function (err,user,info,status){
      if(err){
        ctx.body={
          code: -1,
          msg:err
        }
      }else{
        if(user){
          ctx.body={
            code: 0,
            msg: '登录成功',
            user
          }
          // 使用ctx.login时会触发序列号操作
          return ctx.login(user)
        }else{
          ctx.body={
            code: 1, // code:1表示登录异常
            msg: info
          }
        }
      }
    })(ctx,next)
});

//验证码验证接口
router.post('/verify',async (ctx,next)=> {
  let username = ctx.request.body.username;
  const saveExpire = await Store.hget(`nodemail:${username}`,'expire');
  // 防止用户频繁发生验证
  if(saveExpire&&new Date().getTime() - saveExpire < 0){
    ctx.body={
      code: -1,
      msg:'验证码请求过于频繁'
    }
    return false
  }
  // 创建transporter对象用于默认的SMTP传输服务
  /**
   * @param host  要连接的主机名或IP地址
   * @param port 连接的端口号(默认587)
   * @param secure 设置连接服务器所使用的协议，对于端口587或25，请将其保留为false
   * @param auth 身份验证数据
   */
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth:{
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  //设置发送的信息与方式
  let ko = {
    code :Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }

  let mailOptions = {
    from:`'认证邮件'<${Email.smtp.user}>`,
    to:ko.email,
    subject: '《慕课网高仿美团网全栈实战》注册码',
    html: `您在《慕课网高仿美团网全栈实战》课程中注册，您的邀请码是${ko.code}`
  }

  //发送邮件
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    } else {
      //将邮件的信息存入redis表中
      Store.hmset(`nodemail:${ko.user}`, 'code', ko.code, 'expire', ko.expire, 'email', ko.email)
    }
  })
  //邮件发送后返回响应信息
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }

})

//退出接口
router.get('/exit', async (ctx, next) => {
  //进行注销操作
  await ctx.logout();
  //判断用户是否已经成功退出
  //ctx.isAuthenticated()用于判断用户是否通过passport校验
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

//获取用户名的接口
router.get('/getUser', async (ctx) => {
  if (ctx.isAuthenticated()) {
    //登陆后从session中获取用户信息
    const {username, email} = ctx.session.passport.user;
    ctx.body={
      user:username,
      email
    }
  }else{
    ctx.body={
      user:'',
      email:''
    }
  }
})

export default router;
