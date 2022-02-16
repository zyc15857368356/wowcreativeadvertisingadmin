<template>
  <div>
    <div>
      <el-row>
        <el-col :span="5">
          <div class="sidebar">
            <div class="log-img">

            </div>
            <div class="main-side">
              <el-menu default-active="2"
                       class="el-menu-vertical-demo"
                       @open="handleOpen"
                       @close="handleClose"
                       background-color="#545c64"
                       text-color="#fff"
                       active-text-color="#ffd04b">
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>导航一</span>
                  </template>
                  <el-menu-item-group>
<!--                    <template slot="title">分组一</template>-->
                    <el-menu-item index="1-1" @click="menuClick()">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                  </el-menu-item-group>
                  <el-submenu index="1-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                  </el-submenu>
                </el-submenu>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="3"
                              disabled>
                  <i class="el-icon-document"></i>
                  <span slot="title">导航三</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">导航四</span>
                </el-menu-item>
              </el-menu>
            </div>

          </div>
        </el-col>
        <el-col :span="19">
          <div class="navhead" >
            <div class="user-wrapper">
              <div class="demo-basic--circle" style=" display: table;">
                <div class="block" style="display: table-cell;vertical-align:middle" ><el-avatar :size="40" :src="circleUrl"></el-avatar></div>
              </div>
              <div class="user-main">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                  <el-submenu index="1">
                    <template slot="title">admin</template>
                    <el-menu-item index="1-1">退出登录</el-menu-item>
                  </el-submenu>
                </el-menu>
              </div>
            </div>


          </div>
          <div class="content">
            <main-navbar></main-navbar>
          </div>
        </el-col>
      </el-row>

      <div>
        <div>

        </div>
        <div>

        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import MainNavbar from "../home/mainNavbar";
export default {
  components:{
    MainNavbar
  },
  data() {
    return {
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    menuClick(){
      alert(1111)
    }
  }
}
</script>
<style scoped>
.sidebar{
  height: 100vh;
  background-color: #545c64;
}
.log-img{
  height: 61px;
  background-color: lightgoldenrodyellow;
}
.navhead {
  width: 100%;
  height: 61px;
  float: right;
  background-color:#fff;
  border-bottom: 1px solid rgb(246, 246, 246);
}
.user-wrapper{
  float: right;
  display: flex;
}
.user-main{

}
.content{

  height: 100vh;
}
</style>
