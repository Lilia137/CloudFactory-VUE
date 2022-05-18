<template>
  <div class="login clearfix">
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form ref="loginForm" :model="user" status-icon label-width="80px">
          <h3>注册</h3>
          <hr>
          <el-form-item prop="username" label="用户名">
            <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="注册类型" :label-width="formLabelWidth">
            <el-select v-model="user.type" placeholder="注册类型">
              <el-option label="工厂管理员" value="工厂管理员"></el-option>
              <el-option label="经销商" value="经销商"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="password" label="设置密码">
            <el-input v-model="user.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="重复密码">
            <el-input v-model="user.password2" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item  label="设置邮箱">
            <el-input v-model="user.email"  placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item  label="公司名称">
            <el-input v-model="user.company"  placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" icon @click="doRegister()" >注册账号</el-button>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button plain icon @click="$router.push('/')" >返回</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'register',
  data () {
    return {
      user: {
        username: '',
        email: '',
        password: '',
        type: '',
        company: ''
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  created () {
    // console.log($);
    // console.log("1111");
  },
  methods: {

    doRegister () {
      if (!this.user.username) {
        this.$message.error('请输入用户名！')
      } else if (!this.user.email) {
        this.$message.error('请输入邮箱！')
      } else if (this.user.email != null) {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!reg.test(this.user.email)) {
          this.$message.error('请输入有效的邮箱！')
        } else if (!this.user.password) {
          this.$message.error('请输入密码！')
        } else {
          this.$router.push({ path: '/login' })
          this.$message.success('注册成功！')
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
  overflow: auto;
}
.login-wrap {
  background: floralwhite;
  background-size: cover;
  width: 400px;
  height: 600px;
  margin: 215px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 20px;
}

h3 {
  color: #0babeab8;
  font-size: 24px;
}
hr {
  background-color: #444;
  margin: 20px auto;
}

.el-button {
  width: 80%;
  margin-left: -50px;
}
</style>
