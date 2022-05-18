<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item style="font-weight: bold">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight: bold">所有订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row type="flex" justify="end" align="middle" style="margin-bottom: 20px">
        <el-col :span="7">
          所有订单信息
        </el-col>
        <el-col :span="6">
          <el-input placeholder="输入关键词进行检索" v-model="queryInfo.query" size="mini" clearable @clear="getAllOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getAllOrderList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table
        v-loading="loading"
        :data="allOrderList.slice((queryInfo.currentPage - 1) * queryInfo.pagesize, queryInfo.currentPage * queryInfo.pagesize)"
        stripe>
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
          sortable
          align="center"
          prop="oid" width="100px">
        </el-table-column>
        <el-table-column
          label="产品名称"
          sortable
          align="center"
          prop="pname" width="140px">
        </el-table-column>
        <el-table-column
          label="采购数量"
          sortable
          align="center"
          prop="pnum" width="140px">
        </el-table-column>
        <el-table-column
          label="经销商"
          align="center"
          prop="receiver" width="140px">
        </el-table-column>
        <el-table-column
          label="投标截止日期"
          sortable
          align="center"
          prop="bidFinishDate" width="140px">
        </el-table-column>
        <el-table-column
          label="订单状态"
          align="center"
          prop="ostate">
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
        :total="allOrderList.length"
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
      loading: true,
      // 工厂列表
      allOrderList: [],
      // 创建工厂对话框
      addDialogVisible: false,
      addFactoryForm: {
        fname: '',
        capacity: 1,
        fintro: '',
        allOrderList: []
      },
      // 表单验证规则
      addFactoryFormRules: {
        fname: [
          { required: true, message: '请输入工厂名称', trigger: 'blur' }
        ],
        capacity: [
          { type: 'number', min: 1, max: 50, required: true, message: '车间容量要在1-50之间', trigger: 'blur' }
        ],
        fintro: [
          { required: true, message: '请输入工厂简介', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    const that = this
    that.getAllOrderList()
    console.log('coming data:', that.allOrderList)
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getAllOrderList () {
      const that = this
      var u = '/getAllOrder' + '?' + '&query='
      if (that.queryInfo.query !== '') {
        u = u + that.queryInfo.query
      }
      that.$http({
        method: 'get',
        url: u
      }).then(function (res) {
        console.log('res', res)
        that.allOrderList = res.data[0].list
        that.loading = false
        // 分页
        // that.total = res.data.total
        console.log(that.allOrderList)
      }).catch(function (res) {
        console.log(res)
        that.$message.error('获取失败')
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getAllOrderList()
    },
    handleCurrentChange (currentPage) {
      console.log(currentPage, 'currentPage')
      this.queryInfo.currentPage = currentPage
    },
    // 添加工厂信息
    async showAddDialog () {
      this.addDialogVisible = true
    },
    async addDialogClosed () {
      this.$refs.addFactoryFormRef.resetFields()
    },
    async addFactory () {
      // 提交请求前，表单预验证
      this.$refs.addFactoryFormRef.validate(async valid => {
        // 表单预校验失败
        if (!valid) return
        console.log('valid')
        const that = this
        that.$http({
          method: 'get',
          url: '/addFactory?' + 'fname=' + that.addFactoryForm.fname + '&capacity=' + that.addFactoryForm.capacity + '&fintro=' + that.addFactoryForm.fintro
        }).then(function (res) {
          console.log(res)
          that.getFactoryList()
          that.$message.success('工厂创建成功！')
        }).catch(function (res) {
          that.$message.error('工厂创建失败，请重试！')
        })
        // 隐藏添加用户对话框
        that.addDialogVisible = false
      })
    },
    // 关闭工厂
    async deleteDevice (id) {
      const that = this
      const confirmResult = await this.$confirm(
        '您确定要关停该工厂吗？关停之后，该工厂将无法被分配生产任务。',
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
        url: '/deleteDevice/' + id
      }).then(function (res) {
        console.log(res)
        that.getAllOrderList()
        that.$message.success('关停成功！')
      }).catch(function (res) {
        that.$message.error('关停失败')
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
