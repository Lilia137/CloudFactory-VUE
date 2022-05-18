<template>
  <div class="login" clearfix>
    <el-card class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="loginForm" :model="user" :rules="rules" status-icon label-width="80px">
          <h3>登录</h3>
          <hr>
          <el-form-item prop="username" label="用户名">
            <el-input v-model="user.username" placeholder="请输入用户名" prefix-icon></el-input>
          </el-form-item>
          <el-form-item id="password" prop="password" label="密码">
            <el-input v-model="user.password" show-password placeholder="请输入密码" ></el-input>
          </el-form-item>
          <router-link style="text-align: center;margin-right: 100px" to="/"> </router-link>
          <router-link style="text-align: center" to="/register"> </router-link>
          <el-form-item>
            <el-button type="primary" icon="el-icon-upload" @click="doLogin()" round>登 录</el-button>
            <el-button type="primary" icon="el-icon-user" @click="$router.push('/register')" round>注 册</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {

  name: 'login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  created () {},
  methods: {
    doLogin () {
      if (!this.user.username) {
        this.$message.error('请输入用户名！')
      } else if (!this.user.password) {
        this.$message.error('请输入密码！')
      } else {
        if (this.user.username === '111') {
          this.$router.push('/manager')
          this.$message.success('登陆成功，欢迎云工厂管理员！')
        } else if (this.user.username === '222') {
          this.$router.push('/super')
          this.$message.success('登陆成功，欢迎系统管理员！')
        } else if (this.user.username === '333') {
          this.$router.push('/orderManage')
          this.$message.success('登陆成功，欢迎经销商！')
        } else {
          this.$router.push('/manager')
          this.$message.success('登陆成功，欢迎云工厂管理员！')
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  width: 100%;
  height: 740px;
  background: url("../assets/snow.jpeg");
  background-size: cover;
  overflow: hidden;
}
.login-wrap {
  background: floralwhite;
  background-size: cover;
  width: 400px;
  height: 400px;
  margin: 215px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
}
#password {
  margin-bottom: 5px;
}
h3 {
  color: #0babeab8;
  font-size: 24px;
}
hr {
  background-color: #444;
  margin: 20px auto;
}
a {
  text-decoration: none;
  color: #aaa;
  font-size: 15px;
}
a:hover {
  color: coral;
}
el-button {
  width: 80%;
  margin-left: -50px;
}
</style>
