<template>
  <div class="container">
    <p class="title">WOW后台管理系统</p>
    <div class="loginBox">
      <el-form :label-width="labelWidth">
        <el-form-item label="用户名">
          <el-input v-model="userName"
                    style="width: 200px"
                    size="mini"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="passWord"
                    style="width: 200px"
                    size="mini"></el-input>
        </el-form-item>
      </el-form>
      <el-button size="mini"
                 @click="login"
                 type="primary">登录</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: "",
      passWord: "",
      labelWidth: "80px",
    };
  },
  methods: {
    login() {
      if (this.userName && this.passWord) {
        this.http
          .post(
            "/Auth/Login",
            {
              username: this.userName,
              password: this.passWord
            }
          )
          .then((res) => {
            let MemberId = res.data.Data.MemberId;
            let Role = res.data.Data.Role === "管理员" ? 1 : 0;
            localStorage.setItem("MemberId", MemberId);
            localStorage.setItem("Role", Role);
            if (res.status) {
              this.$router.push({
                path: "/home",
              });
            }
          })
          .catch((res) => {
            this.$message({
              message: res.msg,
              type: "error",
            });
          });
      } else {
        this.$message({
          message: "用户名或密码不能为空",
          type: "warning",
        });
      }
    },
  },
};
</script>
<style scoped>
html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
}
.loginBox {
  width: 400px;
  height: 200px;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
.loginBox >>> .el-form-item__label {
  color: #fff;
}
.title {
  position: absolute;
  top: 27%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 30px;
}
</style>
