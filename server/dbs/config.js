export default {
  dbs:'mongodb://0.0.0.0:27017/student',
  redis:{
    get host(){
      return '0.0.0.0'
    },
    get port(){
      return 6379
    }
  },
  smtp:{
    get host(){
      return 'smtp.qq.com'
    },
    get user(){
      return '1750198339@qq.com'
    },
    get pass(){
      return 'dennflfuakhlfcdd'  //SMTP服务授权码
    },
    //设置验证码
    get code(){
      return ()=>{
        return Math.random().toString(16).slice(2,6).toUpperCase()
      }
    },
    //设置过期时间
    get expire(){
      return ()=>{
        return new Date().getTime()+60*1000
      }
    }
  },

}
