<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item style="font-weight: bold">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight: bold">可投标订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row type="flex" justify="center" align="middle" style="margin-bottom: 20px">
        <el-col :span="3">
          可投标订单信息
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="allChooseOrderList" stripe>
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
          sortable
          label="产品名称"
          align="center"
          prop="pname" width="110px">
        </el-table-column>
        <el-table-column
          sortable
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
          sortable
          label="投标截止日期"
          align="center"
          prop="bidFinishDate" width="130px">
        </el-table-column>
        <el-table-column
          label="订单状态"
          align="center"
          prop="ostate" width="130px">
        </el-table-column>
        <el-table-column align="right">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <el-input placeholder="输入关键词进行检索" v-model="queryInfo.query" size="mini" clearable @clear="getChooseOrderList">
              <el-button slot="append" icon="el-icon-search" @click="getChooseOrderList()"></el-button>
            </el-input>
          </template>
          <template slot-scope="props">
            <el-button type="success" v-if="props.row.ostate === '可投标'" size="mini" @click="showBidDialog(props.row.oid, props.row.pname, props.row.pnum, props.row.receiver, props.row.address)">投标</el-button>
            <el-button type="warning" v-if="props.row.ostate === '待排产'" size="mini" @click="assign(props.row.did)">排产</el-button>
            <el-button type="danger" v-if="props.row.ostate === '生产中'" size="mini" @click="finish(props.row.did)">结束</el-button>
            <el-button type="primary" v-if="props.row.ostate === '待发货'" size="mini" @click="deliver(props.row.did)">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="填写订单信息"
      :visible.sync="bidDialogVisible"
      width="30%" center
      @close="bidDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="bidOrderForm"
        ref="bidOrderFormRef"
        :rules="bidOrderFormRules"
        label-width="80px"
      >
        <el-form-item label="产品名称" prop="pname">
          <span>{{bidOrderForm.pname}}</span>
        </el-form-item>
        <el-form-item label="采购数量" prop="pnum">
          <span>{{bidOrderForm.pnum}}</span>
        </el-form-item>
        <el-form-item label="经销商" prop="receiver">
          <span>{{bidOrderForm.receiver}}</span>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <span>{{bidOrderForm.address}}</span>
        </el-form-item>
        <el-form-item label="投标价格" prop="bidPrice">
          <template>
            <el-input-number v-model="bidOrderForm.bidPrice" style="width: 150px" controls-position="right"></el-input-number>&nbsp;&nbsp;元
          </template>
        </el-form-item>
        <el-form-item label="交付日期" prop="finishDate">
<!--          <el-input type="textarea" :rows="2" v-model="bidOrderForm.finishDate"></el-input>-->
          <el-date-picker
            v-model="bidOrderForm.finishDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="bidDialogVisible = false">取 消</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="success" @click="bidOrder()">确 定</el-button>
      </span>
    </el-dialog>
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
      // 可投标订单列表
      allChooseOrderList: [],
      // 投标对话框
      bidDialogVisible: false,
      bidOrderForm: {
        oid: 0,
        pname: '',
        pnum: '',
        receiver: '',
        address: '',
        bidPrice: 1,
        finishDate: ''
      },
      // 表单验证规则
      bidOrderFormRules: {
        bidPrice: [
          { type: 'number', min: 1, required: true, message: '请输入投标价格,最低为1元', trigger: 'blur' }
        ],
        finishDate: [
          { required: true, message: '请输入交付时间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    const that = this
    that.getChooseOrderList()
    console.log('coming data:', that.allChooseOrderList)
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getChooseOrderList () {
      const that = this
      var u = '/getChooseOrder' + '?' + 'query='
      if (that.queryInfo.query !== '') {
        u = u + that.queryInfo.query
      }
      that.$http({
        method: 'get',
        url: u
      }).then(function (res) {
        console.log('res', res)
        that.allChooseOrderList = res.data[0].list
        // 分页
        // that.total = res.data.total
        console.log(that.allChooseOrderList)
      }).catch(function (res) {
        console.log(res)
        that.$message.error('获取失败')
      })
    },
    // 添加订单信息
    async showBidDialog (oid, pname, pnum, receiver, address) {
      this.bidOrderForm.oid = oid
      this.bidOrderForm.pname = pname
      this.bidOrderForm.pnum = pnum
      this.bidOrderForm.receiver = receiver
      this.bidOrderForm.address = address
      this.bidDialogVisible = true
    },
    async bidDialogClosed () {
      this.$refs.bidOrderFormRef.resetFields()
    },
    transformTime (date) {
      var d = new Date(date)
      var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      return datetime
    },
    async bidOrder () {
      // 提交请求前，表单预验证
      this.$refs.bidOrderFormRef.validate(async valid => {
        // 表单预校验失败
        if (!valid) return
        console.log('valid')
        const that = this
        that.$http({
          method: 'get',
          url: '/bidOrder?' + 'oid=' + that.bidOrderForm.oid + '&bidPrice=' + that.bidOrderForm.bidPrice + '&finishDate=' + that.transformTime(that.bidOrderForm.finishDate)
        }).then(function (res) {
          console.log(res)
          that.getChooseOrderList()
          that.$message.success('投标成功！')
        }).catch(function (res) {
          that.$message.error('投标失败，请重试！')
        })
        // 隐藏添加用户对话框
        that.bidDialogVisible = false
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
