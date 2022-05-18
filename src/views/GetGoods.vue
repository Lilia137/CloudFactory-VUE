<template>
  <el-container style="border: 1px solid #eee">
    <el-header>
      <div>
        <!--          <img src="../assets/logo.png" alt />-->
        <span>云工厂管理系统</span>
      </div>
      <div>
        <!--          <el-badge is-dot :value="12" class="item">-->
        <!--            <el-button type="warning" icon="el-icon-user-solid" circle></el-button>-->
        <!--          </el-badge>-->
        <span style="margin-right: 10px; font-size: 18px">
            <i class="el-icon-user-solid">&nbsp;张杨</i>
        </span>
        <!--          <el-button type="warning" icon="el-icon-user-solid" circle></el-button>-->
        <el-button type="warning" icon="el-icon-s-home" circle></el-button>
        <el-button type="warning" icon="el-icon-switch-button" circle></el-button>
      </div>
    </el-header>
    <el-container style="height: 500px">
      <el-aside width="200px" style="background-color:#333744">
        <el-menu :default-active="activeIndex" background-color="#333744" text-color="#fff" active-text-color="#409EFF">
          <el-menu-item index="1">
            <i class="el-icon-notebook-1"></i>
            <span slot="title" @click="goto('OrderManage')">订单管理</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-notebook-2"></i>
            <span slot="title" @click="goto('GetGoods')">交付订单</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-search"></i>
            <span slot="title" @click="goto('BidInfo')">查看竞标信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-card>

          <div style="text-align: right">
            <span style="margin-right: 430px">交付订单信息表</span>
          </div>
          <!--        <el-table :data="tableData">-->
          <!--          <el-table-column prop="date" label="日期" width="140">-->
          <!--          </el-table-column>-->
          <!--          <el-table-column prop="name" label="姓名" width="120">-->
          <!--          </el-table-column>-->
          <!--          <el-table-column prop="address" label="地址">-->
          <!--          </el-table-column>-->
          <!--        </el-table>-->
          <el-table
              :data="tableData.filter(data => !search
            || data.ID.toLowerCase().includes(search.toLowerCase())
            || data.name.toLowerCase().includes(search.toLowerCase())
            || data.num.toLowerCase().includes(search.toLowerCase())
            || data.seller.toLowerCase().includes(search.toLowerCase())
            || data.admin.toLowerCase().includes(search.toLowerCase())
            || data.deliveryDate.toLowerCase().includes(search.toLowerCase())
            || data.bidDate.toLowerCase().includes(search.toLowerCase())
            || data.state.toLowerCase().includes(search.toLowerCase())
            || data.address.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%">
            <el-table-column
                fixed
                prop="ID"
                label="编号"
                width="55">
            </el-table-column>
            <el-table-column
                prop="name"
                label="产品名称"
                width="90"
                :filters="[{text: '口罩', value: '口罩'}, {text: '手套', value: '手套'}, {text: '防护服', value: '防护服'}]"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                prop="num"
                label="采购数量"
                width="80">
            </el-table-column>
            <el-table-column
                prop="seller"
                label="经销商"
                width="70">
            </el-table-column>
            <el-table-column
                prop="admin"
                label="工厂负责人"
                width="90">
            </el-table-column>
            <el-table-column
                prop="deliveryDate"
                label="交付日期"
                width="80">
            </el-table-column>
            <el-table-column
                prop="bidDate"
                label="投标截止日期"
                width="110">
            </el-table-column>
            <el-table-column
                prop="state"
                label="订单状态"
                width="90"
                :filters="[{text: '未定标', value: '未定标'}, {text: '待排产', value: '待排产'}, {text: '生产中', value: '生产中'}, {text: '已发货', value: '已发货'}, {text: '已完成', value: '已完成'}]"
                :filter-method="filterHandler">
            </el-table-column>
            <el-table-column
                prop="address"
                label="收货地址"
                width="90">
            </el-table-column>
            <!--          <el-table-column-->
            <!--              fixed="right"-->
            <!--              label="操作"-->
            <!--              width="100">-->
            <!--            <template slot-scope="scope">-->
            <!--              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
            <!--              <el-button type="text" size="small">编辑</el-button>-->
            <!--            </template>-->
            <!--          </el-table-column>-->
            <el-table-column
                align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                    v-model="search"
                    size="mini"
                    placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                    size="medium"
                    type="success"
                    :disabled="scope.row.state === '已完成'"
                    @click="handleDelete(scope.$index, scope.row)">确认收货
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
// import row from 'element-ui/packages/row/src/row'

import axios from 'axios'

export default {
  name: 'OrderManage',
  data() {
    return {
      activeIndex: '2',
      tableData: [
        {
          ID: '3004',
          name: '口罩',
          num: '50',
          seller: '张杨',
          admin: '刘阳',
          deliveryDate: '6月4日',
          bidDate: '6月5日',
          state: '已发货',
          address: '南京路'
        },
        {
          ID: '3005',
          name: '口罩',
          num: '50',
          seller: '张杨',
          admin: '刘阳',
          deliveryDate: '6月4日',
          bidDate: '6月5日',
          state: '已完成',
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
      this.$confirm('您确定要收货吗?', '收货确认', {
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
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373f41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.div {
  display: flex;
  align-items: center;
}

.img {
  height: 40px;
}

.span {
  margin-left: 15px;
}

.el-button.is-circle {
  margin-right: 5px;
}

.el-badge__content {
  margin-right: 23px;
  margin-left: 100px;
  margin-top: 8px;
}

.el-aside {

  background-color: #333744;

}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.item {
  margin-top: 10px;
  margin-right: 40px;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
