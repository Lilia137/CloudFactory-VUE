<template>
  <div style="height:100%">
    <el-container style="height:100%">
      <!-- 头部 -->
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
            <i class="el-icon-user-solid">&nbsp;刘阳</i>
          </span>
<!--          <el-button type="warning" icon="el-icon-user-solid" circle></el-button>-->
          <el-button type="warning" icon="el-icon-s-home" @click="gohome" circle></el-button>
          <el-button type="warning" icon="el-icon-switch-button" @click="logout" circle></el-button>
        </div>
      </el-header>
      <!-- 主体 -->
      <el-container style="height:100%">
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="togleCollapse">|||</div>
          <!-- :unique-opened="true"->只允许展开一个菜单 -->
          <!-- :collapse-transition="false" -> 关闭动画 -->
          <!-- router -> 导航开启路由模式 -->
          <el-menu :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#409EFF">
            <!-- 一级菜单  -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id" >
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <i :class="iconObj[item.id]">  </i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                <!-- 导航开启路由模式：
                  将index值作为导航路由 -->
                <!-- 二级菜单的模板区域 -->
                <template slot="title">
                  <i :class="iconObj[subItem.id]"> </i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [{ authName: '工厂管理', children: [{ authName: '我的工厂', id: 111, order: null, path: 'managerFactory' }], id: 125, order: 1, path: 'managerFactory' },
        { authName: '设备管理', children: [{ authName: '我的设备', id: 120, order: null, path: 'managerDevice' }], id: 121, order: 1, path: 'managerDevice' },
        {
          authName: '订单管理',
          children: [{ authName: '所有订单', id: 122, order: null, path: 'managerAllOrder' },
            { authName: '可投标订单', id: 101, order: null, path: 'managerChooseOrder' },
            { authName: '已投标订单', id: 102, order: null, path: 'managerChoosedOrder' },
            { authName: '待排产订单', id: 103, order: null, path: 'managerAssignOrder' },
            { authName: '生产中订单', id: 104, order: null, path: 'managerProduceOrder' },
            { authName: '待发货订单', id: 105, order: null, path: 'managerDeliverOrder' },
            { authName: '已发货订单', id: 106, order: null, path: 'managerDeliveredOrder' },
            { authName: '已完成订单', id: 107, order: null, path: 'managerFinishOrder' }
          ],
          id: 124,
          order: 1,
          path: 'managerAllOrder'
        }],
      iconObj: {
        125: 'el-icon-menu',
        111: 'el-icon-school',
        121: 'el-icon-menu',
        120: 'el-icon-s-cooperation',
        124: 'el-icon-menu',
        122: 'el-icon-document-copy',
        101: 'el-icon-s-flag',
        102: 'el-icon-aim',
        103: 'el-icon-receiving',
        104: 'el-icon-s-data',
        105: 'el-icon-takeaway-box',
        106: 'el-icon-truck',
        107: 'el-icon-finished'

      },
      // 默认不折叠
      isCollapse: false,
      // 被激活导航地址
      activePath: ''
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    gohome () {
      this.$router.push('/managerWelcome')
    },
    // 菜单的折叠与展开
    togleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接的激活地址
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>
<style lang="less" scoped>
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
  > div {
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
    span {
      margin-left: 15px;
    }
  }
  .el-button.is-circle{
    margin-right: 5px;
  }
}
.el-badge {
  /deep/.el-badge__content
  {
    margin-right: 23px;
    //margin-left: 100px;
    margin-top: 8px;
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
 //.item {
 //  margin-top: 10px;
 //  margin-right: 40px;
 //}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
