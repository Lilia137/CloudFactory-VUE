<!-- eslint-disable -->
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item style="font-weight: bold">工厂管理</el-breadcrumb-item>
      <el-breadcrumb-item style="font-weight: bold">我的工厂</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20" type="flex" align="middle" justify="end" style="margin-bottom: 20px">
        <el-col :span="11">
          我的云工厂信息
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="showAddDialog">创建工厂</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="factoryList" stripe>
        <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
        <el-table-column label="编号" prop="fid" width="80px" align="center"></el-table-column>
        <el-table-column label="工厂名称" prop="fname" width="110px" align="center"></el-table-column>
        <el-table-column label="车间容量" prop="capacity" width="110px" align="center"></el-table-column>
        <el-table-column label="负责人" prop="boss" width="110px" align="center"></el-table-column>
        <el-table-column label="工厂简介" prop="fintro" width="110px" align="center"></el-table-column>
        <el-table-column label="工厂状态" prop="fstate" width="110px" align="center"></el-table-column>
        <el-table-column align="right">
          <!-- eslint-disable-next-line -->
          <template slot="header" slot-scope="scope">
            <el-input placeholder="输入关键词检索" v-model="queryInfo.query" size="mini" clearable @clear="getFactoryList">
              <el-button slot="append" icon="el-icon-search" @click="getFactoryList()"></el-button>
            </el-input>
          </template>
          <template slot-scope="scope">
            <el-button type="danger" v-if="scope.row.fstate === '正常'" size="mini" @click="closeFactory(scope.row.fid)">关闭</el-button>
            <el-button type="warning" v-if="scope.row.fstate === '正常'" size="mini" @click="showExpandDialog(scope.row.fid)">扩容</el-button>
            <el-button type="success" v-if="scope.row.fstate === '关闭'" size="mini" @click="reuseFactory(scope.row.fid)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
<!--      <el-pagination-->
<!--        @size-change="handleSizeChange"-->
<!--        @current-change="handleCurrentChange"-->
<!--        :current-page="queryInfo.pagenum"-->
<!--        :page-sizes="[4, 8, 10, 15]"-->
<!--        :page-size="queryInfo.pagesize"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        :total="total"-->
<!--        background-->
<!--        style="margin-top: 10px"></el-pagination>-->
    </el-card>
    <el-dialog
      title="填写工厂信息"
      :visible.sync="addDialogVisible"
      width="50%" center
      @close="addDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="addFactoryForm"
        ref="addFactoryFormRef"
        :rules="addFactoryFormRules"
        label-width="80px"
      >
        <el-form-item label="工厂名称" prop="fname">
          <el-input v-model="addFactoryForm.fname"></el-input>
        </el-form-item>
        <el-form-item label="车间容量" prop="capacity">
          <template>
            <el-input-number v-model="addFactoryForm.capacity" style="width: 150px" controls-position="right"></el-input-number>&nbsp;&nbsp;台设备
          </template>
        </el-form-item>
        <el-form-item label="工厂简介" prop="fintro">
          <el-input type="textarea" :rows="2" v-model="addFactoryForm.fintro"></el-input>
        </el-form-item>
<!--        <el-form-item label="初始设备" prop="deviceList">-->
<!--          <el-button type="primary" icon="el-icon-plus" size="small" @click="showInitDeviceDialog">添加设备</el-button>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addDialogVisible = false">取 消</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="success" @click="addFactory">确 定</el-button>
      </span>
    </el-dialog>
<!--    工厂扩容-->
    <el-dialog
      title="填写扩容数量"
      :visible.sync="expandDialogVisible"
      width="30%" center
      @close="expandDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="expandFactoryForm"
        ref="expandFactoryFormRef"
        :rules="expandFactoryFormRules"
        label-width="80px"
      >
        <el-form-item label="扩容数目" prop="expandNum">
          <template>
            <el-input-number v-model="expandFactoryForm.expandNum" style="width: 150px" controls-position="right"></el-input-number>&nbsp;&nbsp;台设备
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="expandDialogVisible = false">取 消</el-button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="success" @click="expandFactory">确 定</el-button>
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
      radio: '1',
      // 工厂列表
      factoryList: [],
      // 创建工厂对话框
      addDialogVisible: false,
      addFactoryForm: {
        fname: '',
        capacity: 1,
        fintro: '',
        deviceList: []
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
      },
      // 工厂扩容对话框
      expandDialogVisible: false,
      expandFactoryForm: {
        fid: 0,
        expandNum: 0
      },
      // 表单验证规则
      expandFactoryFormRules: {
        expandNum: [
          { type: 'number', min: 0, max: 50, required: true, message: '请输入扩容数量', trigger: 'blur' }
        ]
      }
      // 工厂总数
      // 分页
      // total: 0
    }
  },
  created () {
    const that = this
    that.getFactoryList()
    console.log('coming data:', that.factoryList)
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getFactoryList () {
      const that = this
      // 分页
      // var u = '/factory/allFactory/' + that.queryInfo.pagenum + '/' + that.queryInfo.pagesize
      var u = '/getAllFactory' + '?' + 'query='
      if (that.queryInfo.query !== '') {
        u = u + that.queryInfo.query
      }
      that.$http({
        method: 'get',
        url: u
      }).then(function (res) {
        console.log('res', res)
        that.factoryList = res.data[0].list
        // 分页
        // that.total = res.data.total
        console.log(that.factoryList)
      }).catch(function (res) {
        console.log(res)
        that.$message.error('获取失败')
      })
    },
    // 分页
    // handleSizeChange (newSize) {
    //   this.queryInfo.pagesize = newSize
    //   this.getFactoryList()
    // },
    // handleCurrentChange (newSize) {
    //   this.queryInfo.pagenum = newSize
    //   this.getFactoryList()
    // },
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
    async closeFactory (id) {
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
        url: '/closeFactory?' + 'fid=' + id
      }).then(function (res) {
        console.log(res)
        that.getFactoryList()
        that.$message.success('关停成功！')
      }).catch(function (res) {
        that.$message.error('关停失败')
      })
    },
    // 工厂扩容信息
    async showExpandDialog (id) {
      this.expandFactoryForm.fid = id
      this.expandDialogVisible = true
    },
    async expandDialogClosed () {
      this.$refs.expandFactoryFormRef.resetFields()
    },
    async expandFactory () {
      const that = this
      that.$http({
        method: 'get',
        url: '/expandFactory?' + 'fid=' + that.expandFactoryForm.fid + '&expandNum=' + that.expandFactoryForm.expandNum
      }).then(function (res) {
        console.log(res)
        that.getFactoryList()
        that.$message.success('扩容成功！')
      }).catch(function (res) {
        that.$message.error('扩容失败')
      })
      that.expandDialogVisible = false
    },
    // 恢复工厂
    async reuseFactory (id) {
      const that = this
      const confirmResult = await this.$confirm(
        '您确定要恢复该工厂吗？若点击确认，将会向系统管理员提交复工申请，审核时间月为0-1小时，请您耐心等候。',
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
        url: '/reuseFactory?' + 'fid=' + id
      }).then(function (res) {
        console.log(res)
        that.getFactoryList()
        that.$message.success('复工申请提交成功！')
      }).catch(function (res) {
        that.$message.error('复工失败')
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
