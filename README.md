# vue-meituan
> 这是一个使用Vue全家桶开发仿美团PC端网站
## 技术栈
 vue2.x + axios + vuex + vue-cli + scss + element-UI + koa2
 
 
 ## 目录结构
 ```
 .
 |-- .nuxt					
 |-- assets					// 静态文件
 |-- components					// 组件目录
 |	|-- cart				// 购物车组件目录
 |	|	|-- list.vue
 |	|-- changeCity				// 切换城市组件目录
 |	|	|-- categroy.vue			
 |	|	|-- hot.vue			
 |	|	|-- iselect.vue	
 |	|-- detail				// 商品详情页组件目录
 |	|	|-- crumbs.vue	
 |	|	|-- item.vue	
 |	|	|-- list.vue	
 |	|	|-- summary.vue	
 |	|-- index				// 首页组件目录
 |	|	|-- artistic.vue	
 |	|	|-- life.vue	
 |	|	|-- menu.vue	
 |	|	|-- slider.vue	
 |	|-- order				// 商品订单页组件
 |	|	|-- list.vue	
 |	|-- products				// 商品列表页组件目录
 |	|	|-- categroy.vue	
 |	|	|-- crumbs.vue
 |	|	|-- iselect.vue	
 |	|	|-- list.vue	
 |	|	|-- product.vue	
 |	|-- public				// 公共组件目录
 |	|	|-- footer     // 页面底部组件
 |	|	| |-- index.vue
 |	|	|-- header      //页面顶部组件
 |	|	| |-- geo.vue
 |	|	| |-- index.vue
 |	|	| |-- nav.vue
 |	|	| |-- searchbar.vue
 |	|	| |-- topbar.vue
 |	|	| |-- user.vue	
 |	|-- Logo.vue
 |-- layouts  //页面模板样式目录
 |	|-- blank.vue
 |	|-- default.vue
 |-- pages  //页面目录
 |	|-- cart.vue
 |	|-- changeCity.vue
 |	|-- detail.vue
 |	|-- exit.vue
 |	|-- index.vue
 |	|-- login.vue
 |	|-- order.vue
 |	|-- products.vue
 |-- plugins  //插件目录
 |-- server //服务端文件目录
 |	|-- dbs   //数据库文件目录
 |	|-- interface  //接口目录
 |	|-- index.js
 |-- server //vuex文件目录
 |	|-- modules
 |	|	|-- geo.js
 |	|	|-- home.js
 |	|-- index.js
 |-- README.md					// readme说明
 .
 ```

 ## 项目截图
  ### 注册页
   ![注册页](https://github.com/spBlueCat/vue-meituan/blob/master/screenshots/register.png)
  ### 登录页
   ![登录页](https://github.com/spBlueCat/vue-meituan/blob/master/screenshots/login.png)
  ### 首页
  ![首页](https://github.com/spBlueCat/vue-meituan/blob/master/screenshots/index.png)
  ### 切换城市页
  ![切换城市页](https://github.com/spBlueCat/vue-meituan/blob/master/screenshots/changecity.png)
  ### 产品列表页
   ![产品页](https://github.com/spBlueCat/vue-meituan/blob/master/screenshots/products.png)
  ### 产品详情页
   ![产品详情页](https://github.com/spBlueCat/vue-meituan/blob/master/screenshots/order.png)
  ### 购物车
  ![产品页](https://github.com/spBlueCat/vue-meituan/blob/master/screenshots/detail.png)
  ### 订单页
  ![订单页](https://github.com/spBlueCat/vue-meituan/blob/master/screenshots/order.png)


