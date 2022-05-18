<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item style="font-weight: bold">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight: bold">已完成订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row type="flex" justify="end" align="middle" style="margin-bottom: 15px">
        <el-col :span="7">
          已完成订单信息
        </el-col>
        <el-col :span="6">
          <el-input placeholder="输入关键词进行检索" v-model="queryInfo.query" size="mini" clearable @clear="getChosenOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getChosenOrderList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="chosenOrderList.slice((queryInfo.currentPage - 1) * queryInfo.pagesize, queryInfo.currentPage * queryInfo.pagesize)" stripe>
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
          prop="pname" width="150px">
        </el-table-column>
        <el-table-column
          label="采购数量"
          align="center"
          prop="pnum" width="150px">
        </el-table-column>
        <el-table-column
          label="经销商"
          align="center"
          prop="receiver" width="150px">
        </el-table-column>
        <el-table-column
          label="投标截止日期"
          align="center"
          prop="bidFinishDate" width="140px">
        </el-table-column>
        <el-table-column
          label="订单状态"
          align="center"
          prop="ostate" width="140px">
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.currentPage"
        :page-sizes="[4, 8, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="chosenOrderList.length"
        background
        style="margin-top: 40px; text-align: center"></el-pagination>
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
        pagesize: 4,
        // 当前所在页
        currentPage: 1
      },
      // 可投标订单列表
      chosenOrderList: []
    }
  },
  created () {
    const that = this
    that.getChosenOrderList()
    console.log('coming data:', that.chosenOrderList)
  },
  methods: {
    async getChosenOrderList () {
      const that = this
      var u = '/getFinishOrder' + '?' + 'query='
      if (that.queryInfo.query !== '') {
        u = u + that.queryInfo.query
      }
      that.$http({
        method: 'get',
        url: u
      }).then(function (res) {
        console.log('res', res)
        that.chosenOrderList = res.data[0].list
        // 分页
        // that.total = res.data.total
        console.log(that.chosenOrderList)
      }).catch(function (res) {
        console.log(res)
        that.$message.error('获取失败')
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getChosenOrderList()
    },
    handleCurrentChange (currentPage) {
      console.log(currentPage, 'currentPage')
      this.queryInfo.currentPage = currentPage
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
