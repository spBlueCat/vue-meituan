<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a
          href="/"
          class="site-logo" />
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button
              type="primary"
              size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm">
        <el-form-item
          label="昵称"
          prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email">
          <el-input v-model="ruleForm.email" />
          <el-button
            size="mini"
            round
            @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="code">
          <el-input
            v-model="ruleForm.code"
            maxlength="4" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pwd">
          <el-input
            v-model="ruleForm.pwd"
            type="password" />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="cpwd">
          <el-input
            v-model="ruleForm.cpwd"
            type="password" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="register">同意以下协议并注册</el-button>
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a
            class="f1"
            href="http://www.meituan.com/about/terms"
            target="_blank">《美团网用户协议》</a>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
  import CryptoJS from 'crypto-js'
  export default {
    layout: 'blank',
    data(){
      return{
        statusMsg:  '',
        error:  '',
        ruleForm:{
          name: '',
          code: '', //验证码
          pwd:  '',
          cpwd: '', //校验密码
          email:  ''
        },
        rules:{
          name:[{
            required: true,
            type: 'string',
            message:  '请输入昵称', //message表示自定义默认内容
            trigger:  'blur'  //trigger表示进行校验操作的触发方式
          }],
          email:[{
            required: true,
            type: 'email',
            message:  '请输入邮箱',
            trigger:  'blur'
          }],
          pwd: [{
            required: true,
            message:  '创建密码',
            trigger:  'blur'
          }],
          cpwd: [{
            required: true,
            message: '确认密码',
            trigger: 'blur'
          },{validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.ruleForm.pwd) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }]
        }
      }
    },
    methods:{
      sendMsg(){
        const self = this;
        let namePass; //用于判断用户名是否通过验证
        let emailPass; //用于判断邮箱是否通过验证
        if (self.timerid) {
          return false
        }
        //对用户名进行规则校验
        /**
         * @param  valid  表示被校验表单项的prop的值,如果存在则表示此表单项没有通过验证
         */
        this.$refs['ruleForm'].validateField('name', (valid) => {
          namePass = valid
        });
        self.statusMsg = '';
        //如果用户校验没有通过则返回false
        if (namePass) {
          return false
        }
        this.$refs['ruleForm'].validateField('email', (valid) => {
          emailPass = valid
        });
        //如果通过验证则
        if (!namePass && !emailPass) {
          self.$axios.post('/users/verify', {
            username: encodeURIComponent(self.ruleForm.name), //使用encodeURIComponent()对中文进行编码
            email: self.ruleForm.email
          }).then(({status, data}) => {
            if (status === 200 && data && data.code === 0) {
              let count = 60;
              self.statusMsg = `验证码已发送,剩余${count--}秒`;
              self.timerid = setInterval(function () {
                self.statusMsg = `验证码已发送,剩余${count--}秒`;
                if (count === 0) {
                  self.statusMsg = `请重新发送邮件`;
                  clearInterval(self.timerid)
                }
              }, 1000)
            } else {
              self.statusMsg = data.msg
            }
          })
        }
      },
      register(){
        let self = this;
        //如果通过表单通过校验就向后端发送用户信息
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            self.$axios.post('/users/signup', {
              username: window.encodeURIComponent(self.ruleForm.name),
              password: CryptoJS.MD5(self.ruleForm.pwd).toString(), //使用cryptojs对密码进行MD5加密
              email: self.ruleForm.email,
              code: self.ruleForm.code
            }).then(({status, data}) => {
              //如果注册成功则跳转至登录界面
              if (status === 200) {
                if (data && data.code === 0) {
                  location.href = '/login'
                } else {
                  self.error = data.msg
                }
              } else {
                self.error = `服务器出错，错误码:${status}`
              }
              setTimeout(function () {
                self.error = ''
              }, 1500)
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/css/register/index.scss";
</style>
