<template>
  <el-container style="border: 1px solid #eee">
    <el-header style="text-align: right">
      <span style="font-size: 20px ; margin-right: 900px">经销商</span>
      <span style="font-size: 18px ;text-align: right">王小虎</span>
      <el-badge :value="2" class="item" type="warning">
        <el-button type="warning" icon="el-icon-message-solid" circle></el-button>
      </el-badge>
      <el-button type="danger" icon="el-icon-switch-button" circle></el-button>
    </el-header>
    <el-container style="height: 500px">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-active="activeIndex">
          <el-menu-item index="1">
            <i class="el-icon-s-home"></i>
            <span slot="title" @click="goto('Index')">首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-notebook-1"></i>
            <span slot="title" @click="goto('OrderManage')">订单管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-notebook-2"></i>
            <span slot="title" @click="goto('GetGoods')">交付订单</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-search"></i>
            <span slot="title" @click="goto('BidInfo')">查看竞标信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>

      </el-main>

    </el-container>
  </el-container>
</template>

<script>
// import row from 'element-ui/packages/row/src/row'

import axios from 'axios'

export default {
  name: 'Index',
  data() {
    return {
      activeIndex: '1',
      tableData: [{
        ID: '3001',
        name: '口罩',
        num: '500',
        seller: '张杨',
        admin: '-',
        deliveryDate: '-',
        bidDate: '5月2日',
        state: '可投标',
        address: '南京路'
      },
        {
          ID: '3002',
          name: '口罩',
          num: '500',
          seller: '张杨',
          admin: '-',
          deliveryDate: '-',
          bidDate: '6月5日',
          state: '已投标',
          address: '南京路'
        }],
      search: ''
    }
  },
  mounted() {
    const _this = this
    axios.post('http://localhost:8080/factor/DisplayDevice').then(function (resp) {
      console.log(resp)
      _this.tableData = resp.data
    })
  },
  methods: {
    handleEdit(index, row) {
      this.checkReset(row)
      console.log(index, row)
    },
    handleDelete(index, row) {
      this.checkDelete(row)
      console.log(index, row)
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    add() {
      this.$prompt('请按照以下实例填写订单信息（信息请修改）' +
          '“手套-300件-5月3日-南京路”', '订单创建', {
        confirmButtonText: '发布',
        cancelButtonText: '取消'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '添加成功 '
        })
      })
    },
    checkDelete(row) {
      this.$confirm('此操作将删除该订单, 是否继续?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _this = this
        axios.post('http://localhost:8080/factor/DeleteDevice', 'no=' + row.no).then(function (resp) {
          if (resp.data) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            axios.post('http://localhost:8080/factor/DisplayDevice').then(function (resp) {
              console.log(resp)
              _this.tableData = resp.data
            })
          } else {
            _this.$message.error('删除失败!')
          }
        })
      })
    },
    checkChange(row) {
      this.$prompt('请按照以下实例填写修改后的订单信息（信息请修改）' +
          '“手套-300件-5月3日-南京路”', '订单修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const _this = this
        axios.post('http://localhost:8080/factor/DeleteDevice', 'no=' + row.no).then(function (resp) {
          if (resp.data) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            axios.post('http://localhost:8080/factor/DisplayDevice').then(function (resp) {
              console.log(resp)
              _this.tableData = resp.data
            })
          } else {
            _this.$message.error('删除失败!')
          }
        })
      })
    },
    goto(name) {
      this.$router.replace({name: name})
      // this.$router.replace({name:name,params:this.user});
    },
    checkReset(row) {
      this.$confirm('此操作将关停该设备, 是否继续?', '关停设备', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const _this = this
        axios.post('http://localhost:8080/factor/ShutDevice', 'no=' + row.no).then(function (resp) {
          if (resp.data) {
            this.$message({
              type: 'success',
              message: '关停成功!'
            })
            axios.post('http://localhost:8080/factor/DisplayDevice').then(function (resp) {
              console.log(resp)
              _this.tableData = resp.data
            })
          } else {
            _this.$message.error('关停失败!')
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
m