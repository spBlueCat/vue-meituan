import passport from 'koa-passport';
import LocalStrategy from 'passport-local';
import UserModel from '../../dbs/models/users';
// 用户名密码验证策略
/**
 * @param username 用户输入的用户名
 * @param password 用户输入的密码
 * @param done 验证验证完成后的回调函数，由passport调用
 */
passport.use(new LocalStrategy(async function(username,password,done){
  let where = {
    username
  };
  let result = await UserModel.findOne(where);
  //根据用户名查找密码 并校验密码是否正确
  if(result!=null){
    if(result.password===password){
      return done(null,result);
    }else{
      return done(null,false,'密码错误')
    }
  }else{
    return done(null,false,'用户名不存在')
  }
}));
/*序列化在ctx.login()函数调用时触发,会自动在ctx.state.user中添加done中的第二个参数，并在session中添加用户登录状态*/
// 将user序列化到session中，即sessionID，同时它将作为凭证存储在用户cookie中。
passport.serializeUser(function(user,done){
  done(null,user)
});

/*反序列化，会在用户请求到来的时候从session中解析用户信息，如果在登录状态，则在ctx.state.user中添加ctx.login()函数执行时添加进去的参数*/
//第二段代码是从session反序列化，参数为用户提交的sessionID，若存在则从数据库中查询user并存储于req.user中。
passport.deserializeUser(function(user,done){
  return done(null,user)
});

export default passport;
