<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item style="font-weight: bold">设备管理</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight: bold">我的设备</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20" type="flex" align="middle" justify="end" style="margin-bottom: 20px">
        <el-col :span="11">
          我的设备信息
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="showAddDialog">租用设备</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="deviceList" stripe>
        <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
        <el-table-column label="编号" prop="did" width="60px" align="center"></el-table-column>
        <el-table-column label="设备名称" prop="dname" width="90px" align="center"></el-table-column>
        <el-table-column label="设备类型" prop="dtype" width="80px" align="center"></el-table-column>
        <el-table-column label="产品" prop="productName" width="80px" align="center"></el-table-column>
        <el-table-column label="产能(个/时)" prop="produceAbility" width="100px" align="center"></el-table-column>
        <el-table-column label="设备状态" prop="dstate" width="90px" align="center"></el-table-column>
        <el-table-column label="设备来源" prop="source" width="90px" align="center"></el-table-column>
        <el-table-column label="所属工厂" prop="factoryName" width="90px" align="center"></el-table-column>
        <el-table-column align="right">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <el-input placeholder="输入关键词检索" v-model="queryInfo.query" size="mini" clearable @clear="getDeviceList">
              <el-button slot="append" icon="el-icon-search" @click="getDeviceList()"></el-button>
            </el-input>
          </template>
          <template slot-scope="scope">
            <el-button type="danger" v-if="scope.row.dstate === '空闲' && scope.row.source === '自有'" size="mini" @click="deleteDevice(scope.row.did)">移除</el-button>
            <el-button type="warning" v-if="scope.row.dstate === '空闲' && scope.row.source === '产能中心'" size="mini" @click="returnDevice(scope.row.did)">归还</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="租用设备"
      :visible.sync="addDialogVisible"
      width="64%" center
    >
      <!-- 内容主体 -->
      <el-table :data="rentDeviceList" stripe>
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
            <el-input placeholder="输入关键词检索" v-model="queryInfo.rentQuery" size="mini" clearable @clear="getRentDeviceList">
              <el-button slot="append" icon="el-icon-search" @click="getRentDeviceList()"></el-button>
            </el-input>
          </template>
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showChooseFactoryDialog(scope.row.did)">租 赁</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="addDialogVisible = false">完 成</el-button>
      </span>
    </el-dialog>

    <!-- 选择要租用设备的工厂 -->
    <el-dialog
      title="请选择租用设备的工厂"
      :visible.sync="chooseFactoryDialogVisible"
      width="30%" center
      @close="chooseFactoryDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="chooseFactoryForm"
        ref="chooseFactoryFormRef"
        :rules="chooseFactoryFormRules"
        label-width="80px"
      >
        <el-form-item prop="factoryName">
<!--          <template>-->
<!--            <el-input-number v-model="chooseFactoryForm.factoryName" style="width: 150px" controls-position="right"></el-input-number>&nbsp;&nbsp;台设备-->
<!--          </template>-->
          <template>
            <el-select v-model="chooseFactoryForm.factoryName" style="width: 150px" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                @change="change"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="chooseFactoryDialogVisible = false">取 消</el-button>
        &nbsp;
        <el-button type="success" @click="rentDevice()">确 定</el-button>
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
        rentQuery: ''
      },
      // 设备列表
      deviceList: [],
      // 可租用设备
      rentDeviceList: [],
      options: [{
        value: '云工厂1',
        label: '云工厂1'
      }, {
        value: '云工厂2',
        label: '云工厂2'
      }],
      // 创建设备对话框
      addDialogVisible: false,

      // 工厂扩容对话框
      chooseFactoryDialogVisible: false,
      chooseFactoryForm: {
        did: 0,
        factoryName: ''
      },
      // 表单验证规则
      chooseFactoryFormRules: {
        factoryName: [
          { required: true, message: '请选择要租用设备的工厂', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    const that = this
    that.getDeviceList()
    console.log('coming data:', that.deviceList)
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getDeviceList () {
      const that = this
      var u = '/getAllDevice' + '?' + 'query='
      if (that.queryInfo.query !== '') {
        u = u + that.queryInfo.query
      }
      that.$http({
        method: 'get',
        url: u
      }).then(function (res) {
        console.log('res', res)
        that.deviceList = res.data[0].list
        // 分页
        // that.total = res.data.total
        console.log(that.deviceList)
      }).catch(function (res) {
        console.log(res)
        that.$message.error('获取失败')
      })
    },
    async getRentDeviceList () {
      const that = this
      var u = '/getRentDevice' + '?' + 'query='
      if (that.queryInfo.rentQuery !== '') {
        u = u + that.queryInfo.rentQuery
      }
      that.$http({
        method: 'get',
        url: u
      }).then(function (res) {
        console.log('res', res)
        that.rentDeviceList = res.data[0].list
        // 分页
        // that.total = res.data.total
        console.log(that.rentDeviceList)
      }).catch(function (res) {
        console.log(res)
        that.$message.error('获取失败')
      })
    },
    // 添加设备信息
    async showAddDialog () {
      this.getRentDeviceList()
      this.addDialogVisible = true
    },
    // async closeAddDialog () {
    //   this.getDeviceList()
    //   this.addDialogVisible = false
    // },
    // 工厂扩容信息
    async showChooseFactoryDialog (id) {
      this.chooseFactoryForm.did = id
      this.chooseFactoryDialogVisible = true
    },
    async chooseFactoryDialogClosed () {
      this.$refs.chooseFactoryFormRef.resetFields()
    },
    change (val) {
      const that = this
      this.$set(that.chooseFactoryForm, 'factoryName', val)
      this.$forceUpdate()
    },
    async rentDevice () {
      this.$refs.chooseFactoryFormRef.validate(async valid => {
        // 表单预校验失败
        if (!valid) return
        const that = this
        const confirmResult = await this.$confirm(
          '您确定要租用该设备吗？',
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
          url: '/rentDevice?' + 'did=' + that.chooseFactoryForm.did + '&factoryName=' + that.chooseFactoryForm.factoryName
        }).then(function (res) {
          console.log('res:::')
          console.log(res)
          if (res.data[0].list[0].did === 0) {
            console.log('hahhaha')
            that.openFull()
            return
          }
          that.showAddDialog()
          that.getDeviceList()
          that.$message.success('租用成功！')
        }).catch(function (res) {
          that.$message.success('租用失败！')
          this.openFull()
        })
        that.chooseFactoryDialogVisible = false
      })
    },
    openFull () {
      this.$alert('该工厂车间已满，请您对该工厂进行扩容', '提示', {
        confirmButtonText: '确定'
      })
    },
    // 归还设备
    async returnDevice (id) {
      const that = this
      const confirmResult = await this.$confirm(
        '您确定要归还该设备吗？归还之后它将从您的设备列表中移除。',
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
        url: '/returnDevice?' + 'did=' + id
      }).then(function (res) {
        console.log(res)
        that.getDeviceList()
        that.$message.success('归还成功！')
      }).catch(function (res) {
        that.$message.error('归还失败')
      })
    },
    // 移除设备
    async deleteDevice (id) {
      const that = this
      const confirmResult = await this.$confirm(
        '您确定要移除该设备吗？移除之后它将从您的设备列表中消失。',
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
        url: '/deleteDevice?' + 'did=' + id
      }).then(function (res) {
        console.log(res)
        that.getDeviceList()
        that.$message.success('移除成功！')
      }).catch(function (res) {
        that.$message.error('移除失败')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card{
  height: 800px;
  margin-top: 20px;
}
</style>
