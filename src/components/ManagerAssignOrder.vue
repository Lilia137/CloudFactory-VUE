<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item style="font-weight: bold">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight: bold">待排产订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row type="flex" justify="center" align="middle" style="margin-bottom: 20px">
        <el-col :span="3">
          待排产订单信息
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="assignOrderList" stripe>
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
            <el-input placeholder="输入关键词进行检索" v-model="queryInfo.query" size="mini" clearable @clear="getAssignOrderList">
              <el-button slot="append" icon="el-icon-search" @click="getAssignOrderList()"></el-button>
            </el-input>
          </template>
          <template slot-scope="props">
            <el-button type="warning" v-if="props.row.ostate === '待排产'" size="mini" @click="showChooseDeviceDialog(props.row.oid, props.row.pnum)">排产</el-button>
            <el-button type="danger" v-if="props.row.ostate === '生产中'" size="mini" @click="finish(props.row.did)">结束</el-button>
            <el-button type="primary" v-if="props.row.ostate === '待发货'" size="mini" @click="deliver(props.row.did)">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="选择要排产的设备"
      :visible.sync="chooseDeviceVisible"
      width="64%" center
    >
      <!-- 内容主体 -->
      <el-table :data="avaliableDeviceList" stripe>
        <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
        <el-table-column label="编号" prop="did" width="60px" align="center"></el-table-column>
        <el-table-column label="设备名称" prop="dname" width="90px" align="center"></el-table-column>
        <el-table-column label="设备类型" prop="dtype" width="80px" align="center"></el-table-column>
        <el-table-column label="产品" prop="productName" width="80px" align="center"></el-table-column>
        <el-table-column label="产能(个/时)" prop="produceAbility" width="100px" align="center"></el-table-column>
        <el-table-column label="设备状态" prop="dstate" width="90px" align="center"></el-table-column>
        <el-table-column align="right">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <el-input placeholder="输入关键词检索" v-model="queryInfo.rentQuery" size="mini" clearable @clear="getAvaliableDeviceList">
              <el-button slot="append" icon="el-icon-search" @click="getAvaliableDeviceList()"></el-button>
            </el-input>
          </template>
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showAssignDialog(scope.row.did, scope.row.dname, scope.row.produceAbility)">排 产</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="chooseDeviceVisible = false">完 成</el-button>
      </span>
    </el-dialog>

    <!-- 选择要租用设备的工厂 -->
    <el-dialog
      title="请输入排产信息"
      :visible.sync="assignInfoDialogVisible"
      width="30%" center
      @close="assignInfoDialogClose"
    >
      <!-- 内容主体 -->
      <el-form
        :model="assignInfoForm"
        ref="assignInfoFormRef"
        :rules="assignInfoFormRules"
        label-width="80px"
      >
        <el-form-item label="设备编号" prop="did">
          <span>{{assignInfoForm.did}}</span>
        </el-form-item>
        <el-form-item label="设备名称" prop="dname">
          <span>{{assignInfoForm.dname}}</span>
        </el-form-item>
        <el-form-item label="设备产能" prop="produceAbility">
          <span>{{assignInfoForm.produceAbility}}</span>
        </el-form-item>
        <el-form-item label="采购数量" prop="pnum">
          <span>{{assignInfoForm.pnum}}</span>
        </el-form-item>
        <el-form-item label="排产数量" prop="assignment">
          <template>
            <el-input-number v-model="assignInfoForm.assignment" style="width: 150px" controls-position="right"></el-input-number>&nbsp;&nbsp;个
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="assignInfoDialogVisible = false">取 消</el-button>
        &nbsp;
        <el-button type="success" @click="assignOrder()">确 定</el-button>
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
        pagesize: 4,
        deviceQuery: ''
      },
      // 可投标订单列表
      assignOrderList: [],
      avaliableDeviceList: [],
      // 填写排产信息对话框
      assignInfoDialogVisible: false,
      // 选择可用设备对话框
      chooseDeviceVisible: false,
      assignInfoForm: {
        oid: '',
        did: 0,
        pnum: '',
        dname: '',
        produceAbility: '',
        assignment: 1
      },
      // 表单验证规则
      assignInfoFormRules: {
        assignment: [
          { type: 'number', min: 1, max: 1000, required: true, message: '注：排产数量不能超过订单总量', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    const that = this
    that.getAssignOrderList()
    console.log('coming data:', that.assignOrderList)
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getAssignOrderList () {
      const that = this
      var u = '/getAssignOrder' + '?' + 'query='
      if (that.queryInfo.query !== '') {
        u = u + that.queryInfo.query
      }
      that.$http({
        method: 'get',
        url: u
      }).then(function (res) {
        console.log('res', res)
        that.assignOrderList = res.data[0].list
        // 分页
        // that.total = res.data.total
        console.log(that.assignOrderList)
      }).catch(function (res) {
        console.log(res)
        that.$message.error('获取失败')
      })
    },

    async getAvaliableDeviceList () {
      const that = this
      var u = '/getAvaliableDevice' + '?' + 'query='
      if (that.queryInfo.deviceQuery !== '') {
        u = u + that.queryInfo.deviceQuery
      }
      that.$http({
        method: 'get',
        url: u
      }).then(function (res) {
        console.log('res', res)
        that.avaliableDeviceList = res.data[0].list
        // 分页
        // that.total = res.data.total
        console.log(that.avaliableDeviceList)
      }).catch(function (res) {
        console.log(res)
        that.$message.error('获取失败')
      })
    },
    // 添加设备信息
    async showAssignDialog (did, dname, produceAbility) {
      this.assignInfoForm.did = did
      this.assignInfoForm.dname = dname
      this.assignInfoForm.produceAbility = produceAbility
      this.assignInfoDialogVisible = true
    },
    async assignInfoDialogClose () {
      this.$refs.assignInfoFormRef.resetFields()
    },
    // 工厂扩容信息
    async showChooseDeviceDialog (id, num) {
      this.assignInfoForm.oid = id
      this.assignInfoForm.pnum = num
      this.getAvaliableDeviceList()
      this.chooseDeviceVisible = true
    },
    transformTime (date) {
      var d = new Date(date)
      var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      return datetime
    },
    async assignOrder () {
      // 提交请求前，表单预验证
      this.$refs.assignInfoFormRef.validate(async valid => {
        // 表单预校验失败
        if (!valid) return
        console.log('valid')
        const that = this
        that.$http({
          method: 'get',
          url: '/bidOrder?' + 'oid=' + that.assignInfoForm.oid
        }).then(function (res) {
          console.log(res)
          that.getAssignOrderList()
          that.$message.success('投标成功！')
        }).catch(function (res) {
          that.$message.error('投标失败，请重试！')
        })
        // 隐藏添加用户对话框
        that.assignDialogVisible = false
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
