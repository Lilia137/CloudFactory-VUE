<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item style="font-weight: bold">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight: bold">待发货订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row type="flex" justify="center" align="middle" style="margin-bottom: 20px">
        <el-col :span="3">
          待发货订单信息
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="deliverOrderList" stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="编号">
                <span>{{ props.row.oid }}</span>
              </el-form-item>
              <el-form-item label="产品名称">
                <span>{{ props.row.pname }}</span>
              </el-form-item>
              <el-form-item label="采购数量">
                <span>{{ props.row.pnum }}</span>
              </el-form-item>
              <el-form-item label="经销商">
                <span>{{ props.row.receiver }}</span>
              </el-form-item>
              <el-form-item v-if="props.row.boss !== '-'" label="工厂负责人">
                <span>{{ props.row.boss }}</span>
              </el-form-item>
              <el-form-item v-if="props.row.finishDate !== '-'" label="交付日期">
                <span>{{ props.row.finishDate }}</span>
              </el-form-item>
              <el-form-item v-if="props.row.bidPrice !== '-'" label="投标价格">
                <span>{{ props.row.bidPrice }}</span>
              </el-form-item>
              <el-form-item label="投标截止日期">
                <span>{{ props.row.bidFinishDate }}</span>
              </el-form-item>
              <el-form-item label="订单状态">
                <span>{{ props.row.ostate }}</span>
              </el-form-item>
              <el-form-item label="收货地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="编号"
          align="center"
          prop="oid" width="100px">
        </el-table-column>
        <el-table-column
          label="产品名称"
          align="center"
          prop="pname" width="110px">
        </el-table-column>
        <el-table-column
          label="采购数量"
          align="center"
          prop="pnum" width="110px">
        </el-table-column>
        <el-table-column
          label="经销商"
          align="center"
          prop="receiver" width="110px">
        </el-table-column>
        <el-table-column
          label="投标截止日期"
          align="center"
          prop="bidFinishDate" width="110px">
        </el-table-column>
        <el-table-column
          label="订单状态"
          align="center"
          prop="ostate" width="130px">
        </el-table-column>
        <el-table-column align="right">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <el-input placeholder="输入关键词进行检索" v-model="queryInfo.query" size="mini" clearable @clear="getDeliverOrderList">
              <el-button slot="append" icon="el-icon-search" @click="getDeliverOrderList()"></el-button>
            </el-input>
          </template>
          <template slot-scope="props">
            <el-button type="success" v-if="props.row.ostate === '可投标'" size="mini" @click="showBidDialog(props.row.oid, props.row.pname, props.row.pnum, props.row.receiver, props.row.address)">投标</el-button>
            <el-button type="warning" v-if="props.row.ostate === '待排产'" size="mini" @click="assign(props.row.oid)">排产</el-button>
            <el-button type="danger" v-if="props.row.ostate === '生产中'" size="mini" @click="changeToDeliver(props.row.oid)">结束</el-button>
            <el-button type="primary" v-if="props.row.ostate === '待发货'" size="mini" @click="changeToDelivered(props.row.oid)">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分页
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 列表
      deliverOrderList: []
    }
  },
  created () {
    const that = this
    that.getDeliverOrderList()
    console.log('coming data:', that.deliverOrderList)
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getDeliverOrderList () {
      const that = this
      var u = '/getDeliverOrder' + '?' + 'query='
      if (that.queryInfo.query !== '') {
        u = u + that.queryInfo.query
      }
      that.$http({
        method: 'get',
        url: u
      }).then(function (res) {
        console.log('res', res)
        that.deliverOrderList = res.data[0].list
        // 分页
        // that.total = res.data.total
        console.log(that.deliverOrderList)
      }).catch(function (res) {
        console.log(res)
        that.$message.error('获取失败')
      })
    },
    // 结束生产
    async changeToDelivered (id) {
      const that = this
      const confirmResult = await this.$confirm(
        '您确定要发货吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return
      }
      that.$http({
        method: 'get',
        url: '/changeToDelivered?oid=' + id
      }).then(function (res) {
        console.log(res)
        that.getDeliverOrderList()
        that.$message.success('发货成功！')
      }).catch(function (res) {
        that.$message.error('发货失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  height: 2000px;
  margin-top: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
