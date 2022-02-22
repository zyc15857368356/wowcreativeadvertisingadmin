<template>
  <div>
    <div>
      <el-row>
        <el-col :span="24">
          <div class="navhead navbackground">
            <div class="user-wrapper">
              <div class="demo-basic--circle"
                   style="display: table">
                <div class="block"
                     style="display: table-cell; vertical-align: middle">
                  <el-avatar :size="40"
                             :src="circleUrl"></el-avatar>
                </div>
              </div>
              <div class="user-main">
                <el-menu :default-active="activeIndex"
                         class="el-menu-demo"
                         mode="horizontal"
                         @select="handleSelect">
                  <el-submenu index="1">
                    <template slot="title"
                              style="color: #fff!important">admin</template>
                    <el-menu-item index="1-1"
                                  @click="outLogin">退出登录</el-menu-item>
                  </el-submenu>
                </el-menu>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <div class="sidebar">
            <div class="main-side">
              <el-menu default-active="1"
                       class="el-menu-vertical-demo"
                       @open="handleOpen"
                       @close="handleClose"
                       background-color="#409EFF"
                       text-color="#fff"
                       active-text-color="#ffd04b">
                <el-menu-item index="1"
                              @click="run(1)">
                  <i class="el-icon-menu"></i>
                  <span slot="title">视频管理</span>
                </el-menu-item>
                <el-menu-item index="2"
                              @click="run(2)">
                  <i class="el-icon-menu"></i>
                  <span slot="title">账号管理</span>
                </el-menu-item>
              </el-menu>
            </div>
          </div>
        </el-col>
        <el-col :span="21">
          <div class="content">
            <div style="background: #fff; padding: 20px">
              <router-view></router-view>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      activeIndex: "1",
      activeIndex2: "1",
    };
  },
  methods: {
    run(e) {
      if (e === 1) {
        this.$router.push({
          path: "/home",
        });
      } else {
        this.$router.push({
          path: "/account",
        });
      }
    },
    outLogin() {
      localStorage.clear();
      this.$router.push({
        path: "login",
      });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    menuClick() {
      alert(1111);
    },
  },
};
</script>
<style scoped>
.sidebar {
  height: 89vh;
  background-color: #fff;
}
.navhead {
  width: 100%;
  height: 61px;
  float: right;
  background-color: #fff;
  border-bottom: 1px solid rgb(246, 246, 246);
}
.user-wrapper {
  float: right;
  display: flex;
}
.user-main {
}
.content {
  height: 89vh;
  padding: 20px;
  background: rgb(240, 242, 245);
}
.navbackground {
  background: #409eff;
}
.el-menu {
  background: unset;
}
.el-submenu .is-opend {
  background: unset;
}
</style>
