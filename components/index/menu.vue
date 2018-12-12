<template>
  <div class="m-menu">
    <dl
      class="nav"
      @mouseleave="mouseleave">
      <dt>全部分类</dt>
      <dd
        v-for="(item,index) in $store.state.home.menu"
        :key="index"
        @mouseenter="mouseenter">
        <i :class="item.type"/>{{ item.name }}<span class="arrow"/>
      </dd>
    </dl>
    <div
      v-if="kind"
      class="detail"
      @mouseenter="sover"
      @mouseleave="sout">
      <template
        v-for="(item,index) in currentDetail.child">
        <h4 :key="index">{{ item.title }}</h4>
        <span
          v-for="n in item.child"
          :key="n">{{ n }}</span>
      </template>
    </div>
  </div>
</template>

<script>
    export default {
      data(){
        return {
          kind:'' //表示鼠标移入菜单栏后对应元素的类名
        }
      },
      computed:{
        currentDetail(){ //使用filter获取导航菜单对应项目的详情页
          return this.$store.state.home.menu.filter((item)=>item.type===this.kind)[0]
        }
      },
      methods:{
        mouseleave(){  //鼠标离开元素时将kind值清空
          let _this = this;
          _this._timer=setTimeout(()=>{
            _this.kind=''
          },150)
        },
        mouseenter(e){  //鼠标移入菜单栏时将当前项目元素的子元素i的类名赋值给kind
          this.kind=e.target.querySelector('i').className;
        },
        sover(){  //进入详情页时清除this._tiemr这个定时器，让详情页能够继续显示
          clearTimeout(this._timer)
        },
        sout(){  //鼠标移除详情页时,再让this.kind变为空值
          this.kind=''
        }
      }
    }
</script>

<style scoped>

</style>
